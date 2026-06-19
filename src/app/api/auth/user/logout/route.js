import { userAuthController } from "@/lib/controllers/userAuthController";
export async function POST() { return userAuthController.logout(); }
