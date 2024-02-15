/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.pixabay.com',
                port: '',
                pathname: '/photo/**',
            },
            {
                protocol:'http',
                hostname:'localhost',
                port:'7001',
                pathname:'/images/**'
            }
        ],
    },
}

module.exports = nextConfig
