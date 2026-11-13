require("dotenv").config({ path: "./backend/.env" });
const nodemailer = require("../backend/node_modules/nodemailer");

async function testEmail() {
  console.log("Testing SMTP connection with settings:");
  console.log("Host:", process.env.SMTP_HOST);
  console.log("Port:", process.env.SMTP_PORT);
  console.log("User:", process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log("Verifying connection to mail server...");
    await transporter.verify();
    console.log("✅ SMTP Server Connection Verified Successfully!");

    console.log("Sending test confirmation email to:", process.env.SMTP_USER);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Test Confirmation: NGi Connect Registration Notification",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #f7f9ff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #102B46;">NGi Connect Email Test</h2>
          <p>Congratulations! Your SMTP email service is working properly.</p>
          <div style="background: #102B46; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <span style="font-size: 18px; color: #F28C28; font-weight: bold;">NGI-TEST-2026-SUCCESS</span>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 15px;">Sent from NGi Connect Automated Mailer.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
}

testEmail();
