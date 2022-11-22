/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // eslint : {
  //   ignoreDuringBuilds : true,
  // }
  // async redirects() {
  //   return [
  //     {
  //       source: '/news/:slug',
  //       destination: '/news/',
  //       permanent: false,
  //     },
  //   ]
  // },
}

module.exports = nextConfig
