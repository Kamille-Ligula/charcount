const {models} = require('../../../src/models');
const bcrypt = require('bcrypt');

const {
  lightToneColorsBase,
  darkToneColorsBase
} = require("../../../client/src/lib/toneColorsBase");

const {
  findAllKnownCharacters
} = require("../../requeststoDB");

exports.login = async (socket, io) => {
  try {
    const data = JSON.parse(socket.handshake.auth.token);

    let user = await models.User.findByLogin(data.userName);

    if (user.lighttonecolors && user.darktonecolors) { // populate the tone colors in the database
      if (user.lighttonecolors.length === 0 || user.darktonecolors.length === 0) { // populate the tone colors in the database
        await models.User.update(
          {
            lighttonecolors: lightToneColorsBase,
            darktonecolors: darkToneColorsBase,
          },
          {where: {userName: data.userName}},
        );
      }
    }

    if (data.connectionType !== 'login') {
      return;
    }

    if (!user) {
      socket.emit('ConnectionFeedbackAPI', {
        title: 'wrong identifiers',
      });
      return;
    }

    if (data.password) {
      const matchPasswords = await bcrypt.compare(data.password, user.password);

      if (matchPasswords) {
        socket.connectionToken = data.connectionToken;
        io.to(user.socketid).emit('ConnectionFeedbackAPI', {
          title: 'no multi connection allowed',
        });

        await models.User.update(
          {
            socketid: socket.id,
            connectionToken: data.connectionToken,
          },
          {where: {userName: data.userName}},
        );
      }
    }
    else {
      if (data.connectionToken === user.connectionToken) {
        socket.connectionToken = data.connectionToken;

        io.to(user.socketid).emit("kickedOut_charcountAPI", 'Someone logged in with your identifiers. If it wasn\'t you please make sure your connection is safe.');

        await models.User.update(
          {
            socketid: socket.id,
            connectionToken: data.connectionToken,
          },
          {where: {userName: data.userName}},
        );
      }
    }

    user = await models.User.findByLogin(data.userName);

    if (socket.connectionToken !== user.connectionToken || socket.id !== user.socketid) { // authentication
      socket.emit('ConnectionFeedbackAPI', {
        title: 'wrong identifiers',
      });
      return;
    }

    const knownChars = await findAllKnownCharacters(data.userName) || [];
    const textExists = await models.Text.findOne({ where: { userId: user.id }, });

    socket.emit('KnownCharactersAPI', knownChars);
    socket.emit('toneColorsAPI', {
      lightToneColors: user.lighttonecolors,
      darkToneColors: user.darktonecolors
    });
    socket.emit('userLoggedInAPI', data.userName);
    if (textExists) {
      socket.emit('unlockFeatureAPI', 'RecoveryButton');
    }
  }
  catch(e) {
    console.log(e)

    socket.emit('ConnectionFeedbackAPI', {
      title: 'something went wrong',
    });
  }
}
