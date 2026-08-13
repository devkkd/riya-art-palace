/**
 * Email OTP Service
 * In DUMMY mode: OTP is always 123456, printed to console.
 * In production: uses nodemailer (SMTP) to send a real 6-digit OTP.
 *
 * Session tokens are stored in-memory (Map) with a 10-minute expiry.
 * For multi-instance deployments, swap this for Redis.
 */

const DUMMY_MODE = process.env.EMAIL_OTP_DUMMY !== "false"; // default dummy until SMTP is configured

// Global OTP store (survives Next.js hot-reload in dev)
// For multi-instance production, swap with Redis
if (!global._otpStore) {
  global._otpStore = new Map();
}
const otpStore = global._otpStore;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateSessionToken() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Send OTP to email.
 * Returns { session_token }.
 */
export async function sendEmailOtp(email) {
  const otp = generateOtp();
  const sessionToken = generateSessionToken();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(sessionToken, { email, otp, expiresAt });

  if (DUMMY_MODE) {
    console.log(`[EMAIL OTP DUMMY] To: ${email} | OTP: ${otp} | Session: ${sessionToken}`);
    return { session_token: sessionToken, success: true };
  }

  // Production: send via nodemailer
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Riya Art Palace" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for Riya Art Palace",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#F7F5F3;border-radius:12px">
          <h2 style="color:#0E0E0E;margin-bottom:8px">Riya Art Palace</h2>
          <p style="color:#555;font-size:14px;margin-bottom:24px">Use the OTP below to sign in to your account.</p>
          <div style="background:#fff;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#F85700">${otp}</span>
          </div>
          <p style="color:#888;font-size:12px">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[emailOtp] Failed to send email:", err);
    throw new Error("Failed to send OTP email. Please try again.");
  }

  return { session_token: sessionToken, success: true };
}

/**
 * Verify OTP.
 * Returns { verified: boolean }.
 */
export async function verifyEmailOtp(email, otp, sessionToken) {
  const record = otpStore.get(sessionToken);

  if (!record) return { verified: false, message: "Session expired. Please request a new OTP." };
  if (record.email !== email) return { verified: false, message: "Invalid session." };
  if (Date.now() > record.expiresAt) {
    otpStore.delete(sessionToken);
    return { verified: false, message: "OTP expired. Please request a new one." };
  }

  if (DUMMY_MODE && otp === "123456") {
    otpStore.delete(sessionToken);
    return { verified: true };
  }

  if (record.otp !== otp) {
    return { verified: false, message: "Invalid OTP. Please try again." };
  }

  otpStore.delete(sessionToken);
  return { verified: true };
}
