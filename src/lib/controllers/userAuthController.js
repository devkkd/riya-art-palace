import { cookies } from "next/headers";
import { sendOtp, verifyOtp, loginOrCreateUser, getUserById } from "@/lib/services/userAuthService";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

const COOKIE_NAME = "user_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function setUserCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const userAuthController = {
  async sendOtp(request) {
    try {
      const body = await request.json();
      const phone = (body.phone || "").replace(/\D/g, "");

      if (!phone || phone.length !== 10) {
        return errorResponse("Please enter a valid 10-digit mobile number", 422);
      }

      const result = await sendOtp(phone);
      return successResponse({ session_token: result.session_token, phone });
    } catch (err) {
      console.error("[user/sendOtp]", err);
      return errorResponse("Failed to send OTP. Please try again.", 500);
    }
  },

  async verifyOtp(request) {
    try {
      const body = await request.json();
      const phone        = (body.phone || "").replace(/\D/g, "");
      const otp          = (body.otp || "").trim();
      const sessionToken = (body.session_token || "").trim();

      if (!phone || phone.length !== 10) return errorResponse("Invalid phone number", 422);
      if (!otp)                           return errorResponse("OTP is required",       422);
      if (!sessionToken)                  return errorResponse("Session expired",        422);

      const result = await verifyOtp(phone, otp, sessionToken);

      if (!result.verified) {
        return errorResponse("Invalid or expired OTP. Please try again.", 401);
      }

      const { token, user } = await loginOrCreateUser(phone);
      await setUserCookie(token);

      return successResponse({ user, message: "Login successful" });
    } catch (err) {
      console.error("[user/verifyOtp]", err);
      return errorResponse("Verification failed. Please try again.", 500);
    }
  },

  async me() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(COOKIE_NAME)?.value;

      if (!token) return errorResponse("Not authenticated", 401);

      const payload = await verifyToken(token);
      if (payload.type !== "user") return errorResponse("Not authenticated", 401);

      const user = await getUserById(payload.userId);
      if (!user) {
        await clearUserCookie();
        return errorResponse("User not found", 401);
      }

      return successResponse({ user });
    } catch {
      await clearUserCookie();
      return errorResponse("Not authenticated", 401);
    }
  },

  async logout() {
    await clearUserCookie();
    return successResponse({ message: "Logged out successfully" });
  },

  async updateProfile(request) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(COOKIE_NAME)?.value;
      if (!token) return errorResponse("Not authenticated", 401);

      const payload = await verifyToken(token);
      if (payload.type !== "user") return errorResponse("Not authenticated", 401);

      const { connectDB } = await import("@/lib/db/connect");
      const { default: User } = await import("@/lib/models/User");
      await (await import("@/lib/db/connect")).default();

      const body = await request.json();
      const user = await User.findById(payload.userId);
      if (!user) return errorResponse("User not found", 404);

      if (body.name  !== undefined) user.name  = body.name.trim();
      if (body.email !== undefined) user.email = body.email.trim().toLowerCase();
      await user.save();

      return successResponse({
        user: {
          id:    user._id.toString(),
          phone: user.phone,
          name:  user.name,
          email: user.email,
        },
        message: "Profile updated",
      });
    } catch (err) {
      console.error("[user/updateProfile]", err);
      return errorResponse("Failed to update profile", 500);
    }
  },

  async addAddress(request) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(COOKIE_NAME)?.value;
      if (!token) return errorResponse("Not authenticated", 401);

      const payload = await verifyToken(token);
      if (payload.type !== "user") return errorResponse("Not authenticated", 401);

      const connectDB = (await import("@/lib/db/connect")).default;
      const { default: User } = await import("@/lib/models/User");
      await connectDB();

      const body    = await request.json();
      const user    = await User.findById(payload.userId);
      if (!user) return errorResponse("User not found", 404);

      if (body.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
      }

      user.addresses.push({
        label:     body.label     || "Home",
        firstName: body.firstName || "",
        lastName:  body.lastName  || "",
        line1:     body.line1     || "",
        line2:     body.line2     || "",
        city:      body.city      || "",
        state:     body.state     || "",
        pincode:   body.pincode   || "",
        country:   body.country   || "India",
        phone:     body.phone     || "",
        altPhone:  body.altPhone  || "",
        isDefault: !!body.isDefault,
      });

      await user.save();
      return successResponse({ addresses: user.addresses, message: "Address saved" });
    } catch (err) {
      console.error("[user/addAddress]", err);
      return errorResponse("Failed to save address", 500);
    }
  },

  async deleteAddress(request, context) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(COOKIE_NAME)?.value;
      if (!token) return errorResponse("Not authenticated", 401);

      const payload = await verifyToken(token);
      if (payload.type !== "user") return errorResponse("Not authenticated", 401);

      const connectDB = (await import("@/lib/db/connect")).default;
      const { default: User } = await import("@/lib/models/User");
      await connectDB();

      const params = await context.params;
      const user = await User.findById(payload.userId);
      if (!user) return errorResponse("User not found", 404);

      user.addresses = user.addresses.filter((a) => a._id.toString() !== params.addressId);
      await user.save();

      return successResponse({ addresses: user.addresses, message: "Address removed" });
    } catch (err) {
      console.error("[user/deleteAddress]", err);
      return errorResponse("Failed to remove address", 500);
    }
  },
};
