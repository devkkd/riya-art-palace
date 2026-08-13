import connectDB from "@/lib/db/connect";
import User from "@/lib/models/User";
import { signToken } from "@/lib/utils/jwt";
import { sendEmailOtp, verifyEmailOtp } from "@/lib/services/emailOtpService";

export { sendEmailOtp as sendOtp, verifyEmailOtp as verifyOtp };

/**
 * After OTP is verified, find-or-create user by email and return JWT.
 */
export async function loginOrCreateUser(email) {
  await connectDB();

  let user = await User.findOne({ email, isActive: true });

  if (!user) {
    user = await User.create({ email });
  } else {
    user.lastLogin = new Date();
    await user.save();
  }

  const token = await signToken({
    userId: user._id.toString(),
    email:  user.email,
    type:   "user",
  });

  return {
    token,
    user: {
      id:        user._id.toString(),
      email:     user.email,
      phone:     user.phone,
      name:      user.name,
      addresses: user.addresses,
    },
  };
}

/**
 * Get user by ID (for /api/auth/user/me).
 */
export async function getUserById(userId) {
  await connectDB();
  const user = await User.findById(userId).lean();
  if (!user || !user.isActive) return null;
  return {
    id:        user._id.toString(),
    email:     user.email || "",
    phone:     user.phone || "",
    name:      user.name || "",
    addresses: user.addresses || [],
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
}
