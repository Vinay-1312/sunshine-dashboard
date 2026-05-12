// Runs via GitHub Actions daily at 8 AM UK time.
// Required env vars: SENDGRID_API_KEY, SENDER_EMAIL, PARTNER_EMAIL, PARTNER_NAME, DASHBOARD_URL
require('dotenv').config();
const nodemailer = require('nodemailer');
const days = require('../data/days.json');

const START_DATE = '2026-05-12';

function getTodayDay() {
  const start = new Date(START_DATE);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const index = ((diff % 90) + 90) % 90;
  return days[index];
}

const VIBE_COLORS = {
  motivational: { bg: '#0f3460', accent: '#ffd700' },
  playful:      { bg: '#ff6b6b', accent: '#ffd93d' },
  cozy:         { bg: '#d4793a', accent: '#fff3e0' }
};

function buildHtml(dayData, partnerName, dashboardUrl) {
  const c = VIBE_COLORS[dayData.vibe] || VIBE_COLORS.cozy;
  const { day, greeting, affirmation, joke, miniChallenge, loveNote } = dayData;
  const accentBorder = dayData.vibe === 'cozy' ? '#d4793a' : c.accent;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Daily Sunshine ☀️</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:580px;margin:24px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,0.12);">

  <div style="background:${c.bg};padding:44px 30px 32px;text-align:center;">
    <div style="font-size:52px;margin-bottom:10px;">☀️</div>
    <h1 style="color:${c.accent};margin:0 0 6px;font-size:30px;letter-spacing:2px;font-family:Georgia,serif;">Daily Sunshine</h1>
    <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px;">Day ${day} of 90 · Just for you, ${partnerName}</p>
  </div>

  <div style="padding:28px 28px 8px;">

    <h2 style="font-family:Georgia,serif;font-style:italic;color:#333;font-size:26px;text-align:center;margin:0 0 24px;">${greeting}</h2>

    <div style="background:linear-gradient(135deg,#fffbe6,#fff3cc);border-left:4px solid ${accentBorder};border-radius:10px;padding:20px;margin-bottom:16px;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#999;margin:0 0 8px;">✨ Today's Affirmation</p>
      <p style="color:#333;margin:0;font-size:17px;line-height:1.7;font-style:italic;">"${affirmation}"</p>
    </div>

    <div style="background:#f7f7f7;border-radius:10px;padding:20px;margin-bottom:16px;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#999;margin:0 0 8px;">😄 Today's Joke</p>
      <p style="color:#333;margin:0;font-size:16px;line-height:1.65;">${joke}</p>
    </div>

    <div style="background:linear-gradient(135deg,#e3f2fd,#bbdefb);border-radius:10px;padding:20px;margin-bottom:16px;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#555;margin:0 0 8px;">🎯 Mini Challenge</p>
      <p style="color:#1a3a5c;margin:0;font-size:16px;line-height:1.65;">${miniChallenge}</p>
    </div>

    ${/* Love Note section — commented out for now
    <div style="background:linear-gradient(135deg,#fce4ec,#f8bbd0);border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#c2185b;margin:0 0 12px;">💌 A Note from Your Person</p>
      <p style="color:#880e4f;margin:0;font-size:19px;line-height:1.7;font-style:italic;">"${loveNote}"</p>
    </div>
    */ ''}

    <div style="text-align:center;padding-bottom:28px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:${c.bg};color:${c.accent};text-decoration:none;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:bold;letter-spacing:1px;">
        Open Today's Sunshine ☀️
      </a>
    </div>

  </div>

  <div style="background:#fafafa;border-top:1px solid #eee;padding:16px;text-align:center;">
    <p style="color:#bbb;margin:0;font-size:12px;">Made with 💛 · Day ${day} of 90</p>
  </div>

</div>
</body>
</html>`;
}

async function main() {
  const { SENDGRID_API_KEY, SENDER_EMAIL, PARTNER_EMAIL, PARTNER_NAME, DASHBOARD_URL } = process.env;

  if (!SENDGRID_API_KEY || !SENDER_EMAIL || !PARTNER_EMAIL) {
    console.error('Missing required env vars: SENDGRID_API_KEY, SENDER_EMAIL, PARTNER_EMAIL');
    process.exit(1);
  }

  const dayData = getTodayDay();
  const partnerName = PARTNER_NAME || 'Sunshine';
  const dashboardUrl = DASHBOARD_URL || 'https://your-site.vercel.app';

  // SendGrid SMTP — username is always the literal string "apikey"
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: { user: 'apikey', pass: SENDGRID_API_KEY }
  });

  await transporter.sendMail({
    from: `"Daily Sunshine ☀️" <${SENDER_EMAIL}>`,
    to: PARTNER_EMAIL,
    subject: `☀️ Day ${dayData.day}: ${dayData.greeting}`,
    html: buildHtml(dayData, partnerName, dashboardUrl)
  });

  console.log(`✓ Sunshine email sent for Day ${dayData.day} (${dayData.vibe})`);
}

main().catch(err => {
  console.error('Failed to send email:', err.message);
  process.exit(1);
});
