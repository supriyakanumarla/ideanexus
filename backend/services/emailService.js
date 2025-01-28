const nodemailer = require('nodemailer');

const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendResetEmail = async (userEmail, resetToken) => {
  try {
    const transporter = await createTestAccount();
    
    const mailOptions = {
      from: '"IdeaNexus Support" <support@ideanexus.test>',
      to: userEmail,
      subject: 'Password Reset Request - IdeaNexus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>You requested a password reset for your IdeaNexus account.</p>
          <p>Your password reset code is: <strong style="color: #007bff; font-size: 18px;">${resetToken}</strong></p>
          <p>This code will expire in 1 hour.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Error sending reset email');
  }
};

module.exports = { sendResetEmail }; 