import connectDB from "@/lib/db/connect";
import Admin from "@/lib/models/Admin";
import { comparePassword, hashPassword } from "@/lib/utils/password";
import { signToken } from "@/lib/utils/jwt";

export async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  await connectDB();

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    return existing;
  }

  const hashedPassword = await hashPassword(password);
  return Admin.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });
}

export async function loginAdmin(email, password) {
  await ensureDefaultAdmin();

  const admin = await Admin.findOne({
    email: email.toLowerCase(),
    isActive: true,
  }).select("+password");

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isValid = await comparePassword(password, admin.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = await signToken({
    adminId: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  return {
    token,
    admin: {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}

export async function getAdminById(adminId) {
  await connectDB();
  const admin = await Admin.findById(adminId).select("-password");
  if (!admin || !admin.isActive) {
    return null;
  }
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    lastLogin: admin.lastLogin,
  };
}
