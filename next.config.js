/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Required for GitHub Pages
    basePath: '/postcard',
}

module.exports = nextConfig 