require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (recieverEmail, subject, message) => {
  const msg = {
    to: recieverEmail,
    from: "info@geocodec.com", // Use the email address or domain you verified above
    subject: subject,
    text: message,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("it has happened", error);
    });
};

const sendEmailWithHtml = () => {};

module.exports = {
  sendEmail,
  sendEmailWithHtml,
};
