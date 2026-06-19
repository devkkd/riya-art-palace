import { userAuthController } from "@/lib/controllers/userAuthController";
export async function GET()              { return userAuthController.me(); }
export async function PUT(request)       { return userAuthController.updateProfile(request); }
