import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongodb', 'cloudinary', 'nodemailer'],
};

export default nextConfig;
