const {models} = require('../../../src/models');
const { recoveryPasswordTimeout } = require("../../timeouts");

const { findRecoveryPassword } = require("../../requeststoDB");

exports.reset = async (socket) => {
  try {
    const data = JSON.parse(socket.handshake.auth.token);

    const User = await models.User.findByLogin(data.userName);

    if (data.connectionType !== 'reset') {
      return;
    }

    if (!User) {
      socket.emit('ConnectionFeedbackAPI', {
        title: 'wrong name',
      });
      return;
    }

    const recoveryPassword = await findRecoveryPassword(User.id);

    if (!recoveryPassword || !recoveryPassword.text || recoveryPassword.text.length === 0) {
      socket.emit('ConnectionFeedbackAPI', {
        title: 'enter email recovery password',
        email: User.email,
      });
      return;
    }

    if (
      data.recoveryPassword !== recoveryPassword.text &&
      Date.now() - recoveryPassword.updatedAt.getTime() > recoveryPasswordTimeout.maths
    ) {
      socket.emit('ConnectionFeedbackAPI', {
        title: 'password doesn\'t match or expired',
      });
      return;
    }

    await models.User.update(
      {
        password: data.password,
      },
      {where: {userName: User.userName}},
    );
    await models.RecoveryPassword.destroy({ where: { userId: User.id } });
    socket.emit('ConnectionFeedbackAPI', {
      title: 'password was reset',
    });
  }
  catch(e) {
    console.log(e)

    socket.emit('ConnectionFeedbackAPI', {
      title: 'something went wrong',
    });
  }
}
