import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse, successResponse } from "@/lib/utils/response";

// GET /api/upload/presign?filename=foo.jpg&contentType=image/jpeg
// Returns a presigned URL to upload directly to R2 from the browser
export async function GET(request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) return errorResponse("Unauthorized", 401);

    const { searchParams } = new URL(request.url);
    const filename    = searchParams.get("filename") || "upload.jpg";
    const contentType = searchParams.get("contentType") || "image/jpeg";

    const endpoint        = process.env.CLOUDFLARE_R2_ENDPOINT;
    const accessKeyId     = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const bucketName      = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const publicUrl       = process.env.CLOUDFLARE_R2_PUBLIC_URL;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
      return errorResponse("R2 not configured", 500);
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: endpoint.startsWith("http") ? endpoint : `https://${endpoint}`,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    // Clean filename + unique key
    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `products/${Date.now()}-${cleanName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

    const finalUrl = publicUrl
      ? `${publicUrl.replace(/\/$/, "")}/${key}`
      : `${endpoint.replace(/\/$/, "")}/${bucketName}/${key}`;

    return successResponse({ presignedUrl, publicUrl: finalUrl, key });
  } catch (err) {
    console.error("[presign]", err);
    return errorResponse("Failed to generate upload URL: " + err.message, 500);
  }
}
