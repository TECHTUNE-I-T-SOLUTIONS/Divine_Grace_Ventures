// lib/sendEmail.ts
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  // Create a transporter using your email service's SMTP server
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another service like Outlook, SMTP, etc.
    auth: {
      user: process.env.EMAIL_FROM,  // Your email address
      pass: process.env.EMAIL_PASSWORD,  // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,  // Sender's email
    to: to,  // Recipient's email
    subject: subject,
    html: htmlContent,  // HTML content for email design
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
