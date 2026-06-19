/**
 * Seed default admin into MongoDB.
 * Run: npm run seed:admin
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    console.error("Missing .env.local — copy env.example to .env.local first.");
    process.exit(1);
  }
  readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    });
}

loadEnv();

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function seed() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!uri || !email || !password) {
    console.error("Set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Admin already exists:", email);
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await Admin.create({ name, email: email.toLowerCase(), password: hashed, role: "admin" });
    console.log("Admin created:", email);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
