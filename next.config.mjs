/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // cloudflare-static 分支：纯静态导出，供 Cloudflare Pages 托管
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
