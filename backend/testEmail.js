// testEmail.js
const transporter = require('./config/email');

const sendTestEmail = async () => {
  try {
    const mailOptions = {
      from: `"Test Sender" <${process.env.EMAIL_FROM}>`,
      to: 'pavenkodaniel@hotmail.com', // Replace with a valid email address
      subject: 'Test Email from Nodemailer',
      text: 'This is a test email sent from your Nodemailer configuration.',
      html: '<p>This is a <strong>test email</strong> sent from your Nodemailer configuration.</p>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

sendTestEmail();
