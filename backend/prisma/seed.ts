import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── 1. Seed Admin User ──
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    throw new Error(
      'ADMIN_USERNAME dan ADMIN_PASSWORD_HASH harus diisi di .env sebelum menjalankan seed.'
    );
  }

  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      passwordHash: adminPasswordHash,
    },
    create: {
      username: adminUsername,
      passwordHash: adminPasswordHash,
    },
  });
  console.log(`✓ Admin user created/verified: ${admin.username} (id: ${admin.id})`);

  // ── 2. Seed FAQ Items ──
  const faqData = [
    {
      question: 'Apa itu Sougen Creative Management?',
      answer:
        'Sougen Creative Management adalah Event Organizer & Creative Management yang berfokus pada industri kreatif dan budaya pop Jepang di Makassar, menyelenggarakan berbagai acara seperti festival cosplay, showcase musik J-Pop, dan pameran kreatif.',
      displayOrder: 1,
    },
    {
      question: 'Bagaimana cara mendaftar event Sougen?',
      answer:
        'Pendaftaran event dilakukan melalui link registrasi yang tersedia di halaman detail event. Pendaftaran biasanya melalui Google Form atau platform tiket pihak ketiga yang telah bermitra.',
      displayOrder: 2,
    },
    {
      question: 'Apakah event Sougen berbayar?',
      answer:
        'Tergantung jenis acaranya. Beberapa event komunitas dibuka gratis untuk umum, sementara event festival utama memerlukan tiket masuk. Informasi harga tiket selalu dicantumkan secara transparan di halaman detail event.',
      displayOrder: 3,
    },
    {
      question: 'Bagaimana cara komunitas atau kreator berkolaborasi dengan Sougen?',
      answer:
        'Komunitas, kreator, dan brand yang tertarik berkolaborasi dapat menghubungi kami melalui halaman Contact atau langsung via WhatsApp/Instagram resmi. Kami sangat terbuka untuk kerja sama booth, penampilan panggung, hingga sponsorship.',
      displayOrder: 4,
    },
    {
      question: 'Di mana biasanya event Sougen diadakan?',
      answer:
        'Event Sougen diadakan di berbagai venue strategis di Makassar. Detail lokasi spesifik, peta venue, dan petunjuk arah selalu diinformasikan pada halaman detail tiap event.',
      displayOrder: 5,
    },
  ];

  for (const faq of faqData) {
    await prisma.fAQItem.upsert({
      where: { id: faq.displayOrder },
      update: {
        question: faq.question,
        answer: faq.answer,
      },
      create: faq,
    });
  }
  console.log(`✓ ${faqData.length} FAQ items seeded`);

  // ── 3. Seed Dummy Event ──
  const dummyEvent = await prisma.event.upsert({
    where: { slug: 'sougen-fest-vol-1' },
    update: {},
    create: {
      slug: 'sougen-fest-vol-1',
      name: 'Sougen Fest Vol. 1',
      theme: 'The Awakening of Creative Culture',
      description: 'Festival akbar perdana persembahan Sougen Creative Management yang menghadirkan kolaborasi musik, cosplay, seni visual, dan panggung kreator terbesar di Makassar.',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-16'),
      location: 'Makassar Convention Center',
      heroMode: 'TEMPLATE',
      isActive: false,
      eventDays: {
        create: [
          {
            dayNumber: 1,
            date: new Date('2026-10-15'),
          },
          {
            dayNumber: 2,
            date: new Date('2026-10-16'),
          },
        ],
      },
    },
  });
  console.log(`✓ Dummy event created: "${dummyEvent.name}" (slug: ${dummyEvent.slug})`);

  // ── 4. Seed About Content (Singleton) ──
  await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {
      storyText:
        'Sougen Creative Management lahir dari semangat dan dedikasi terhadap perkembangan industri kreatif serta budaya pop Jepang di Makassar. Berawal dari gerakan komunitas kreator, cosplayer, dan penikmat seni visual, Sougen berkembang menjadi creative event organizer profesional yang menghadirkan pengalaman acara berkualitas tinggi di Sulawesi Selatan.',
      visionText:
        'Menjadi creative management dan event organizer budaya pop terdepan di Indonesia Timur yang memberdayakan talenta lokal serta menghadirkan pengalaman acara yang inovatif, profesional, dan inklusif.',
      missionList: [
        'Menyelenggarakan event budaya pop dan showcase kreatif berkualitas tinggi secara berkala',
        'Membangun ekosistem kolaborasi yang solid antar komunitas kreatif di Makassar',
        'Memberikan panggung dan wadah profesional bagi talenta lokal untuk berkembang',
        'Mengembangkan apresiasi publik terhadap industri kreatif dan seni kontemporer',
      ],
    },
    create: {
      storyText:
        'Sougen Creative Management lahir dari semangat dan dedikasi terhadap perkembangan industri kreatif serta budaya pop Jepang di Makassar. Berawal dari gerakan komunitas kreator, cosplayer, dan penikmat seni visual, Sougen berkembang menjadi creative event organizer profesional yang menghadirkan pengalaman acara berkualitas tinggi di Sulawesi Selatan.',
      visionText:
        'Menjadi creative management dan event organizer budaya pop terdepan di Indonesia Timur yang memberdayakan talenta lokal serta menghadirkan pengalaman acara yang inovatif, profesional, dan inklusif.',
      missionList: [
        'Menyelenggarakan event budaya pop dan showcase kreatif berkualitas tinggi secara berkala',
        'Membangun ekosistem kolaborasi yang solid antar komunitas kreatif di Makassar',
        'Memberikan panggung dan wadah profesional bagi talenta lokal untuk berkembang',
        'Mengembangkan apresiasi publik terhadap industri kreatif dan seni kontemporer',
      ],
    },
  });
  console.log('✓ About content seeded');

  // ── 5. Seed Site Settings (Singleton) ──
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteTitle: 'Sougen Creative Management',
      siteDescription: 'Event Organizer & Creative Management Budaya Pop Jepang Makassar',
      footerDescription: 'Creative Management & Event Organizer Budaya Pop Jepang di Makassar.',
      footerCopyright: '© 2026 Sougen Creative Management. All rights reserved.',
    },
    create: {
      siteTitle: 'Sougen Creative Management',
      siteDescription: 'Event Organizer & Creative Management Budaya Pop Jepang Makassar',
      footerDescription: 'Creative Management & Event Organizer Budaya Pop Jepang di Makassar.',
      footerCopyright: '© 2026 Sougen Creative Management. All rights reserved.',
    },
  });
  console.log('✓ Site settings seeded');

  console.log('\n🎉 Seed selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

