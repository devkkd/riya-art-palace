import { userAuthController } from "@/lib/controllers/userAuthController";
export async function POST(request) { return userAuthController.addAddress(request); }
