import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function getS3Client() {
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.warn("WARNING: Cloudflare R2 credentials are not fully configured in environment variables.");
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: endpoint.startsWith("http") ? endpoint : `https://${endpoint}`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Required for Cloudflare R2 to prevent SSL handshake errors
  });
}

/**
 * Uploads a file buffer to Cloudflare R2 and returns the public asset URL.
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} The uploaded file URL
 */
export async function uploadToR2(fileBuffer, fileName, mimeType) {
  const s3 = getS3Client();
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!s3 || !bucketName) {
    throw new Error(
      "Cloudflare R2 is not configured. Please add CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_ENDPOINT, and CLOUDFLARE_R2_BUCKET_NAME to your .env.local file."
    );
  }

  // Clean filename and make unique
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueName = `categories/${Date.now()}-${cleanName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3.send(command);

    // Construct delivery URL
    if (publicUrl) {
      const cleanPublicUrl = publicUrl.replace(/\/$/, "");
      return `${cleanPublicUrl}/${uniqueName}`;
    }

    // Fallback: endpoint/bucket/key
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT.replace(/\/$/, "");
    return `${endpoint}/${bucketName}/${uniqueName}`;
  } catch (error) {
    console.error("Cloudflare R2 Upload Error:", error);
    throw new Error(`Cloudflare R2 upload failed: ${error.message}`);
  }
}
