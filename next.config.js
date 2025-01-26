/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://postcards.my' : '',
}

module.exports = nextConfig 