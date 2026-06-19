import { authController } from "@/lib/controllers/authController";

export async function POST(request) {
  return authController.login(request);
}
