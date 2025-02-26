import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  try {
    console.log(`Sending OTP to ${email}...`);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true', // true for SSL (465), false for TLS (587)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHTML = `
      <div style="background: linear-gradient(135deg, indigo, purple); padding: 20px; color: white; text-align: center; font-family: Arial, sans-serif;">
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto;">
          <img src="https://i.ibb.co/jjzqRPt/logo.png" alt="Brand Logo" style="max-width: 50px; margin-bottom: 10px;">
          <h1 style="color: indigo;">DIVINE GRACE VENTURES</h1>
          <h2 style="color: #4B0082;">Your OTP Code</h2>
          <p style="color: #333;">Your One-Time Password (OTP) is:</p>
          <h1 style="color: #8A2BE2; font-size: 24px; margin: 10px 0;">${otp}</h1>
          <p style="color: #555;">This OTP is valid for 10 minutes.</p>
          <hr style="margin: 20px 0; border: 1px solid #ddd;">
          <p>Visit our website: <a href="https://yourwebsite.com" style="color: #4B0082; text-decoration: none;">Divine Grace Ventures</a></p>
          <div style="margin-top: 10px;">
            <a href="https://wa.me/2348144409511" style="margin-right: 10px;">
              <img src="https://img.icons8.com/?size=100&id=QkXeKixybttw&format=png&color=000000" alt="WhatsApp" style="width: 30px;">
            </a>
            <a href="https://facebook.com/divine_grace_ventures">
              <img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="Facebook" style="width: 30px;">
            </a>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP Code',
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);

    return { success: true };
  } catch (error: any) {
    console.error('Email OTP error:', error);
    return { success: false, error: error.message };
  }
}
