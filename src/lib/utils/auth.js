import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";

/**
 * Checks if the current request is authenticated with a valid admin session.
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return false;

    const payload = await verifyToken(token);
    return !!payload && !!payload.adminId;
  } catch (error) {
    return false;
  }
}
