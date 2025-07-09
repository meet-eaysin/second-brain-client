export const preloadRoute = (routeImport: () => Promise<any>) => {
    const link = document.createElement('link')
    link.rel = 'modulepreload'
    link.href = routeImport.toString()
    document.head.appendChild(link)
}

export default {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunk
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    // Feature-based chunks
                    auth: ['@/modules/auth'],
                    dashboard: ['@/modules/dashboard'],
                    linkedin: ['@/modules/linkedin'],
                    ui: ['@/components/ui'],
                },
            },
        },
    },
}