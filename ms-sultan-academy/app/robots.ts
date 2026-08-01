import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mssultanacademy.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/student/', '/admin/', '/api/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
