import connectDB from "@/lib/db/connect";
import User from "@/lib/models/User";
import { signToken } from "@/lib/utils/jwt";
import { sendOtp, verifyOtp } from "@/lib/services/shiprocketService";

export { sendOtp, verifyOtp };

/**
 * After OTP is verified, find-or-create user in MongoDB and return JWT.
 */
export async function loginOrCreateUser(phone) {
  await connectDB();

  let user = await User.findOne({ phone, isActive: true });

  if (!user) {
    user = await User.create({ phone });
  } else {
    user.lastLogin = new Date();
    await user.save();
  }

  const token = await signToken({
    userId: user._id.toString(),
    phone:  user.phone,
    type:   "user",
  });

  return {
    token,
    user: {
      id:        user._id.toString(),
      phone:     user.phone,
      name:      user.name,
      email:     user.email,
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
    phone:     user.phone,
    name:      user.name || "",
    email:     user.email || "",
    addresses: user.addresses || [],
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
}
