const {models} = require('../../../src/models');
const bcrypt = require('bcrypt');

const {
  findAllKnownCharacters
} = require("../../requeststoDB");

exports.login = async (socket, io) => {
  try {
    const data = JSON.parse(socket.handshake.auth.token);

    let user = await models.User.findByLogin(data.userName);

    if (data.connectionType !== 'login') {
      return;
    }

    if (!user) {
      socket.emit('ConnectionFeedbackAPI', 'Wrong identifiers');
      return;
    }

    if (data.password) {
      const matchPasswords = await bcrypt.compare(data.password, user.password);

      if (matchPasswords) {
        socket.connectionToken = data.connectionToken;

        io.to(user.socketid).emit("kickedOut_charcountAPI", 'You can only be connected in one place at a time. You were disconnected from here because you connected elsewhere. If it wasn\'t you please make sure your connection is safe.');

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
      socket.emit('ConnectionFeedbackAPI', 'Wrong identifiers');
      return;
    }

    const knownChars = await findAllKnownCharacters(data.userName) || [];
    const textExists = await models.Text.findOne({ where: { userId: user.id }, });

    socket.emit('KnownCharactersAPI', knownChars);
    socket.emit('userLoggedInAPI', data.userName);
    if (textExists) {
      socket.emit('unlockFeatureAPI', 'RecoveryButton');
    }
  }
  catch(e) {
    console.log(e)

    socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
  }
}
