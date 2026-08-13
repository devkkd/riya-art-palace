import connectDB from "@/lib/db/connect";
import Enquiry from "@/lib/models/Enquiry";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";

// ── POST /api/enquiry  (public — submit new enquiry) ─────────────────────────
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      type, companyName, contactName, businessEmail,
      country, phone, enquiryType, orderQty,
      productCategory, customisation, packaging, message,
    } = body;

    // Basic validation
    if (!["export", "india"].includes(type))
      return errorResponse("Invalid enquiry type", 422);
    if (!companyName?.trim())   return errorResponse("Company name is required",   422);
    if (!contactName?.trim())   return errorResponse("Contact name is required",   422);
    if (!businessEmail?.trim()) return errorResponse("Business email is required", 422);
    if (!country?.trim())       return errorResponse("Country is required",        422);
    if (!phone?.trim())         return errorResponse("Phone is required",          422);

    const enquiry = await Enquiry.create({
      enquiryVariant:  type,
      companyName:     companyName.trim(),
      contactName:     contactName.trim(),
      businessEmail:   businessEmail.trim().toLowerCase(),
      country:         country.trim(),
      phone:           phone.trim(),
      enquiryType:     enquiryType     || "",
      orderQty:        orderQty        || "",
      productCategory: productCategory || "",
      customisation:   customisation   || "",
      packaging:       packaging       || "",
      message:         message         || "",
    });

    return successResponse(
      { id: enquiry._id.toString(), message: "Enquiry submitted successfully" },
      201
    );
  } catch (err) {
    console.error("[enquiry/post]", err);
    return errorResponse("Failed to submit enquiry. Please try again.", 500);
  }
}

// ── GET /api/enquiry  (admin only — list enquiries) ──────────────────────────
export async function GET(request) {
  try {
    // Admin auth check
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);

    const payload = await verifyToken(token);
    if (!payload.adminId) return errorResponse("Unauthorized", 401);

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status  = searchParams.get("status")  || "";
    const variant = searchParams.get("variant") || "";
    const page    = parseInt(searchParams.get("page")  || "1");
    const limit   = parseInt(searchParams.get("limit") || "20");

    const filter = {};
    if (status)  filter.status         = status;
    if (variant) filter.enquiryVariant = variant;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);

    const formatted = enquiries.map((e) => ({
      id:              e._id.toString(),
      enquiryVariant:  e.enquiryVariant,
      companyName:     e.companyName,
      contactName:     e.contactName,
      businessEmail:   e.businessEmail,
      country:         e.country,
      phone:           e.phone,
      enquiryType:     e.enquiryType,
      orderQty:        e.orderQty,
      productCategory: e.productCategory,
      customisation:   e.customisation,
      packaging:       e.packaging,
      message:         e.message,
      status:          e.status,
      adminNotes:      e.adminNotes,
      createdAt:       e.createdAt,
    }));

    return successResponse({ enquiries: formatted, total, page, limit });
  } catch (err) {
    console.error("[enquiry/get]", err);
    return errorResponse("Failed to fetch enquiries", 500);
  }
}
