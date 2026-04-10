const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const fromEmail = process.env.EMAIL_USER;

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"DEHO Support" <${fromEmail}>`,
    to,
    subject: 'Mã OTP xác thực đặt lại mật khẩu',
    html: `
      <h3>Mã xác nhận của bạn là:</h3>
      <p style="font-size: 20px; font-weight: bold;">${otp}</p>
      <p>OTP có hiệu lực trong 5 phút.</p>
    `
  });
};

module.exports = sendOtpEmail;
