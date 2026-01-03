import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://barcoda.vercel.app/',
      lastModified: '2026-01-04',
      changeFrequency: 'weekly',
      priority: 0.5,
      images: ['https://barcoda.vercel.app/OpenGraph.webp'],
    },
  ]
}