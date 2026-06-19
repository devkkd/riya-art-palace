import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validators/authValidator";
import { loginAdmin, getAdminById } from "@/lib/services/authService";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

const COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const authController = {
  async login(request) {
    try {
      const body = await request.json();
      const parsed = loginSchema.safeParse(body);

      if (!parsed.success) {
        const message =
          parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const { email, password } = parsed.data;
      const { token, admin } = await loginAdmin(email, password);

      await setAuthCookie(token);
      return successResponse({ admin, message: "Login successful" });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return errorResponse(error.message, 401);
      }
      console.error("[auth/login]", error);
      return errorResponse("Unable to sign in. Please try again.", 500);
    }
  },

  async logout() {
    await clearAuthCookie();
    return successResponse({ message: "Logged out successfully" });
  },

  async me() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(COOKIE_NAME)?.value;

      if (!token) {
        return errorResponse("Not authenticated", 401);
      }

      const payload = await verifyToken(token);
      const admin = await getAdminById(payload.adminId);

      if (!admin) {
        await clearAuthCookie();
        return errorResponse("Not authenticated", 401);
      }

      return successResponse({ admin });
    } catch {
      await clearAuthCookie();
      return errorResponse("Not authenticated", 401);
    }
  },
};
