import { authController } from "@/lib/controllers/authController";

export async function GET() {
  return authController.me();
}
