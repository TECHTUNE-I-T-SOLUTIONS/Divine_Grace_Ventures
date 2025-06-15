// lib/emailService.ts
import emailjs from '@emailjs/nodejs';

export async function sendOtpEmail(email: string, otp: string) {
  try {
    const emailJsResponse = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.OTP_TEMPLATE_ID!, // Your EmailJS OTP template ID
      { email, otp },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    console.log('OTP email sent via EmailJS');
    return { success: true, response: emailJsResponse };
  } catch (err) {
    console.error('EmailJS failed:', err);
    return { success: false, error: 'Failed to send OTP via EmailJS' };
  }
}
