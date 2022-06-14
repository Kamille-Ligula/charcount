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
      socket.emit('ConnectionFeedbackAPI', 'Please make sure you didn\'t type your name wrong.');
      return;
    }

    const recoveryPassword = await findRecoveryPassword(User.id);

    if (!recoveryPassword || !recoveryPassword.text || recoveryPassword.text.length === 0) {
      socket.emit(
        'ConnectionFeedbackAPI',
        'Please enter the recovery password that was sent to you by email at '+models.User.email+'.'
      );
      return;
    }

    if (
      data.recoveryPassword !== recoveryPassword.text &&
      Date.now() - recoveryPassword.updatedAt.getTime() > recoveryPasswordTimeout.maths
    ) {
      socket.emit(
        'ConnectionFeedbackAPI',
        'Either your recovery password doesn\'t match the one we sent to you by email, or it expired. Remember that recovery passwords are only available for a certain amount of time.'
      );
      return;
    }

    await models.User.update(
      {
        password: data.password,
      },
      {where: {userName: User.userName}},
    );
    await models.RecoveryPassword.destroy({ where: { userId: User.id } });
    socket.emit('ConnectionFeedbackAPI', 'Your password was successfully reset. You can now use it to sign in.');
  }
  catch(e) {
    console.log(e)

    socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
  }
}
