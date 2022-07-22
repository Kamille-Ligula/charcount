const {models} = require('../../../src/models');
const { sendEmail } = require("../../sendEmail");
const { recoveryPasswordTimeout } = require("../../timeouts");
const { createRandomString } = require("../../createRandomString");

exports.recover = async (socket) => {
  try {
    const data = JSON.parse(socket.handshake.auth.token);

    const User = await models.User.findByLogin(data.userName);

    if (data.connectionType !== 'recover') {
      return;
    }

    if (!User) {
      socket.emit('ConnectionFeedbackAPI', {
        title: 'input doesn\'t match user or email',
      });
      return;
    }

    const randomString = createRandomString('', 16, 16, 2);

    const emailSubject = 'Charcount account recovery';
    const emailText = `Hi, ${User.userName}.
      <p/> You requested a password change on
      Charcount. You can use the below recovery password in order to reset your log in password:
      <p/>Your user name: ${User.userName}
      <br/>Your recovery password: ${randomString}
      <p/>This recovery password will expire in ${recoveryPasswordTimeout.english}.
      <p/>If you didn't request this email, please simply ignore it.
      `;
    sendEmail(emailSubject, emailText, User.email);

    await models.RecoveryPassword.destroy({ where: { userId: User.id } });
    await models.RecoveryPassword.create(
      {
        text: randomString,
        userId: User.id,
      },
    );

    socket.emit('ConnectionFeedbackAPI', {
      title: 'recovery email sent',
      email: User.email,
    });
  }
  catch(e) {
    console.log(e)

    socket.emit('ConnectionFeedbackAPI', {
      title: 'something went wrong',
    });
  }
}
