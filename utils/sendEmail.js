const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'smtp.gmail.com', // You can use any email service like SendGrid or Mailgun
  port: 465,
  secure: true,
  auth: {
    user: 'abakahjoshua1@gmail.com', // Replace with your email address
    pass: 'ijdm civf atbt xdxt'  // Replace with your email password (or use OAuth2)
  },
  connectionTimeout: 10000, // 10 seconds
});

// Send Email Function
const sendEmail = ({to, subject, html,text}) => {
  const mailOptions = {
    from: 'abakahjoshua1@gmail.com',
    to,
    subject,
    html,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmail;
