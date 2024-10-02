import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
  console.log("📤 Email sent :  " + to);
};
