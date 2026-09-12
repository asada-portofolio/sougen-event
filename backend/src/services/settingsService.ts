import fs from 'fs';
import path from 'path';
import { prisma } from '../utils/prisma';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';

export interface UpdateSettingsData {
  siteTitle?: string;
  siteDescription?: string;
  footerDescription?: string;
  footerCopyright?: string;
}

/** Dapatkan pengaturan situs (singleton). Jika tidak ada, buat otomatis. */
export async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 1,
        siteTitle: 'Reality Project Organizer',
        siteDescription: 'Event Organizer budaya pop Jepang di Makassar.',
        footerDescription: 'Reality Project Organizer adalah platform manajemen acara budaya pop Jepang terkemuka di Makassar. Bergabunglah dengan berbagai kegiatan menarik kami.',
        footerCopyright: '© 2026 Reality Project Organizer. All rights reserved.',
      },
    });
  }

  // Auto-sanitize: Jika file gambar hero di lokal disk hilang (misal akibat ephemeral container reset),
  // set nilainya ke null agar frontend tidak melakukan request 404 ke resource yang tidak ada.
  if (settings && settings.heroImageUrl && settings.heroImageUrl.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), settings.heroImageUrl);
    if (!fs.existsSync(localPath)) {
      settings.heroImageUrl = null;
    }
  }

  return settings;
}

export async function updateSettings(data: UpdateSettingsData) {
  return await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      ...data,
    },
  });
}

export async function uploadHeroImage(fileBuffer: Buffer) {
  const current = await getSettings();

  const { url } = await processAndSaveImage(fileBuffer, 'settings', {
    generateThumb: false,
    fullMaxWidth: 1920,
    quality: 80,
  });

  if (current.heroImageUrl) {
    await deleteImageFile(current.heroImageUrl);
  }

  return await prisma.siteSettings.update({
    where: { id: 1 },
    data: { heroImageUrl: url },
  });
}
