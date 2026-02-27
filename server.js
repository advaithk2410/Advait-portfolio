require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));   // serve portfolio files from same folder

// ── Gmail Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── POST /send-email ─────────────────────────────────────────────────────────
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // ── 1. Notification email TO Advait ─────────────────────────────────────
    await transporter.sendMail({
      from: '"Portfolio Contact" <advaithk24@gmail.com>',
      to: 'advaithk24@gmail.com',
      subject: `📬 New Contact: ${name} — Portfolio`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#10b981,#059669);padding:28px 32px;">
            <h1 style="margin:0;color:#fff;font-size:22px;">📬 New Contact Message</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Someone reached out via your portfolio</p>
          </div>
          <div style="padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#94a3b8;font-size:13px;width:90px;">Name</td>
                <td style="padding:10px 0;color:#f0f4f8;font-weight:600;">${name}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.08);">
                <td style="padding:10px 0;color:#94a3b8;font-size:13px;">Email</td>
                <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#10b981;">${email}</a></td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.08);">
                <td style="padding:10px 0;color:#94a3b8;font-size:13px;vertical-align:top;">Message</td>
                <td style="padding:10px 0;color:#f0f4f8;line-height:1.7;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
          </div>
          <div style="background:rgba(16,185,129,0.08);padding:16px 32px;border-top:1px solid rgba(16,185,129,0.2);">
            <a href="mailto:${email}?subject=Re: Your message to Advait Kulkarni" 
               style="display:inline-block;background:#10b981;color:#000;padding:10px 22px;border-radius:50px;text-decoration:none;font-weight:700;font-size:13px;">
              ↩ Reply to ${name}
            </a>
          </div>
        </div>
      `
    });

    // ── 2. Auto-reply TO the person who contacted ────────────────────────────
    await transporter.sendMail({
      from: '"Advait Kulkarni" <advaithk24@gmail.com>',
      to: email,
      subject: `Thanks for reaching out, ${name}! 🙌`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e5e7eb;border-radius:12px;overflow:hidden;">
          
          <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:-0.5px;">Advait Kulkarni</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Full Stack Developer &amp; Cybersecurity Enthusiast</p>
          </div>

          <div style="padding:32px;">
            <p style="font-size:17px;font-weight:600;color:#f0f4f8;margin:0 0 12px;">Hi ${name}, 👋</p>
            <p style="color:#94a3b8;line-height:1.8;margin:0 0 16px;">
              Thank you so much for contacting me! I truly appreciate you taking the time to reach out. 
              Your message has been received, and I'll get back to you as soon as possible.
            </p>
            <p style="color:#94a3b8;line-height:1.8;margin:0 0 16px;">
              I am a <strong style="color:#10b981;">Full Stack Developer &amp; Cybersecurity Enthusiast</strong> who is 
              passionate about building reliable, secure, and efficient software solutions. 
              Whether it's a web application, a machine learning project, or a cybersecurity tool — 
              I am here to help you build something great.
            </p>
            <p style="color:#94a3b8;line-height:1.8;margin:0 0 24px;">
              I will review your message and respond at the earliest. Looking forward to collaborating!
            </p>

            <div style="background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;color:#64748b;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Your Message</p>
              <p style="margin:0;color:#d1d5db;font-style:italic;line-height:1.7;">"${message.replace(/\n/g, '<br>')}"</p>
            </div>

            <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
              <p style="margin:0 0 4px;color:#64748b;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Contact Details</p>
              <p style="margin:8px 0;color:#94a3b8;font-size:14px;">📧 <a href="mailto:advaithk24@gmail.com" style="color:#10b981;">advaithk24@gmail.com</a></p>
              <p style="margin:8px 0;color:#94a3b8;font-size:14px;">📞 +91 8431390017</p>
              <p style="margin:8px 0;color:#94a3b8;font-size:14px;">📍 Belgavi, Karnataka, India</p>
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.3);padding:16px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;color:#475569;font-size:12px;">© 2025 Advait Kulkarni · Belgavi, Karnataka, India</p>
          </div>
        </div>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Portfolio server running at: http://localhost:${PORT}`);
  console.log(`   Open your portfolio at:      http://localhost:${PORT}/index.html\n`);
});
