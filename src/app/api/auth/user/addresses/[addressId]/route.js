import { userAuthController } from "@/lib/controllers/userAuthController";
export async function DELETE(request, context) { return userAuthController.deleteAddress(request, context); }
