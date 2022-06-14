const {models} = require('../../../src/models');
const { sendEmail } = require("../../sendEmail");
const { createRandomString } = require("../../createRandomString");

exports.register = async (socket, app) => {
  try {
    const data = JSON.parse(socket.handshake.auth.token);

    if (data.connectionType !== 'register') {
      return;
    }

    if (!data.userName || !data.email || !data.password) {
      socket.emit('ConnectionFeedbackAPI', 'Please fill in all the fields.');
      return;
    }

    const User = await models.User.findByLogin(data.userName);
    const Email = await models.User.findByLogin(data.email);

    if (User) {
      socket.emit('ConnectionFeedbackAPI', 'This name has already been registered to another account.');
      return;
    }

    if (Email) {
      socket.emit('ConnectionFeedbackAPI', 'This email address has already been registered to another account.');
      return;
    }

    const randomString = createRandomString('', 48, 32, 2);

    app.get('/'+randomString, async (req, res) => {
      res.send('Your account was successfully created! You can now close this window and proceed to logging in in order to use Charcount.')

      await models.User.create(
        {
          userName: data.userName,
          email: data.email,
          password: data.password,
        },
      );
    });

    const emailSubject = 'Confirm your Charcount email address';
    const emailText = `Hi, ${data.userName}, <p/> Please confirm your registration email address on
      Charcount by clicking this link: <p/>
      <a href=${process.env.CLIENT_ENDPOINT}/${randomString}>${process.env.CLIENT_ENDPOINT}/${randomString}</a>
      <p/>If you didn't request this email, please simply ignore it.
      `;
    sendEmail(emailSubject, emailText, data.email);

    socket.emit('ConnectionFeedbackAPI', 'We sent you a confirmation email from the address miranteule@gmail.com. Please follow the instructions inside in order to complete your registration.');
  }
  catch(e) {
    console.log(e)

    socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
  }
}
