import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST) {
    console.log(`Email skipped for ${to}: ${subject}`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};

