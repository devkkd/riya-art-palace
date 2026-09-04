/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase body size limit for image uploads (Vercel default is 4.5MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
