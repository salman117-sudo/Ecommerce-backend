import nodemailer from "nodemailer";
import env from "#env";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce Verification" <${env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
          <h2>Verify your email</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 8px;">${code}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};