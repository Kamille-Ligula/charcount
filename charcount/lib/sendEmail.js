const nodemailer = require('nodemailer');
const { recoveryPasswordTimeout } = require("./timeouts");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_GENERATED_PASSWORD
  }
});

exports.sendEmail = (subject, text, emailAddress) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: emailAddress,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (error, info) => { if (error) { console.log(error) } });
}
