import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.rpo.com';

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function getSitemap(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Ambil data dinamis
    const events = await prisma.event.findMany({
      select: { slug: true, updatedAt: true },
      where: { isActive: true }
    });

    const eventsWithGallery = await prisma.event.findMany({
      where: {
        galleryPhotos: { some: {} }
      },
      select: { slug: true, updatedAt: true }
    });

    // List rute statis
    const staticRoutes = [
      '',
      '/about',
      '/contact',
      '/faq',
      '/safety',
      '/community',
      '/programs',
      '/line-up',
      '/event',
      '/gallery'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const today = new Date().toISOString();

    // Tambahkan static routes
    for (const route of staticRoutes) {
      xml += `
  <url>
    <loc>${FRONTEND_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }

    // Tambahkan event routes
    for (const event of events) {
      xml += `
  <url>
    <loc>${FRONTEND_URL}/event/${escapeXml(event.slug)}</loc>
    <lastmod>${event.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    // Tambahkan gallery routes
    for (const event of eventsWithGallery) {
      xml += `
  <url>
    <loc>${FRONTEND_URL}/gallery/${escapeXml(event.slug)}</loc>
    <lastmod>${event.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
}
