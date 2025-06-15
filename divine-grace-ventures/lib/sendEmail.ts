// lib/sendEmail.ts
import emailjs from '@emailjs/nodejs';

/**
 * Sends an email using a single generic EmailJS template with dynamic subject and message.
 *
 * @param to - The recipient's email address
 * @param subject - The subject line of the email
 * @param message - The main message body (HTML or text)
 */
export async function sendEmail(to: string, subject: string, message: string) {
  if (
    !process.env.EMAILJS_SERVICE_ID ||
    !process.env.EMAILJS_PUBLIC_KEY ||
    !process.env.EMAILJS_PRIVATE_KEY ||
    !process.env.GENERIC_TEMPLATE_ID
  ) {
    throw new Error('Missing required EmailJS environment variables');
  }

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.GENERIC_TEMPLATE_ID, // Reuse password reset/OTP template
      {
        to_email: to,
        subject,
        message,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log(`Email successfully sent to ${to} via EmailJS`);
    return { success: true, response };
  } catch (err) {
    console.error('EmailJS failed to send email:', err);
    throw new Error('EmailJS failed to send email');
  }
}
