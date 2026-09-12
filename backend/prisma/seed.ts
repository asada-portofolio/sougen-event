import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
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
    update: {},
    create: {
      username: adminUsername,
      passwordHash: adminPasswordHash,
    },
  });
  console.log(`✓ Admin user created/verified: ${admin.username} (id: ${admin.id})`);

  // ── 2. Seed FAQ Items ──
  const faqData = [
    {
      question: 'Apa itu Reality Project Organizer (RPO)?',
      answer:
        'RPO adalah Event Organizer yang berfokus pada budaya pop Jepang di Makassar, menyelenggarakan berbagai acara seperti festival cosplay, showcase musik J-Pop, dan workshop budaya.',
      displayOrder: 1,
    },
    {
      question: 'Bagaimana cara mendaftar event RPO?',
      answer:
        'Pendaftaran event dilakukan melalui link registrasi yang tersedia di halaman detail event. Biasanya pendaftaran melalui Google Form atau platform tiket pihak ketiga.',
      displayOrder: 2,
    },
    {
      question: 'Apakah event RPO berbayar?',
      answer:
        'Tergantung jenis eventnya. Beberapa event gratis untuk umum, sementara event besar biasanya memerlukan tiket masuk. Informasi harga selalu dicantumkan di halaman event.',
      displayOrder: 3,
    },
    {
      question: 'Bagaimana cara komunitas bisa berkolaborasi dengan RPO?',
      answer:
        'Komunitas yang tertarik berkolaborasi bisa menghubungi kami melalui halaman Contact atau langsung via WhatsApp/Instagram. Kami terbuka untuk kerja sama booth, showcase, dan kegiatan bersama.',
      displayOrder: 4,
    },
    {
      question: 'Di mana biasanya event RPO diadakan?',
      answer:
        'Event RPO biasanya diadakan di berbagai venue di Makassar. Lokasi spesifik akan diinformasikan di halaman detail event masing-masing.',
      displayOrder: 5,
    },
  ];

  for (const faq of faqData) {
    await prisma.fAQItem.upsert({
      where: { id: faq.displayOrder },
      update: {},
      create: faq,
    });
  }
  console.log(`✓ ${faqData.length} FAQ items seeded`);

  // ── 3. Seed Dummy Event ──
  const dummyEvent = await prisma.event.upsert({
    where: { slug: 'reality-fest-vol-1' },
    update: {},
    create: {
      slug: 'reality-fest-vol-1',
      name: 'Reality Fest Vol. 1',
      theme: 'The Beginning of Reality',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-16'),
      location: 'Makassar Convention Center',
      heroMode: 'TEMPLATE',
      isActive: false,
      eventDays: {
        create: [
          {
            dayNumber: 1,
            date: new Date('2025-03-15'),
          },
          {
            dayNumber: 2,
            date: new Date('2025-03-16'),
          },
        ],
      },
    },
  });
  console.log(`✓ Dummy event created: "${dummyEvent.name}" (slug: ${dummyEvent.slug})`);

  // ── 4. Seed About Content (Singleton) ──
  await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      storyText:
        'Reality Project Organizer (RPO) lahir dari kecintaan terhadap budaya pop Jepang di Makassar. Berawal dari komunitas kecil penggemar anime dan cosplay, RPO berkembang menjadi event organizer profesional yang menghadirkan pengalaman budaya pop Jepang terbaik di Sulawesi Selatan.',
      visionText:
        'Menjadi event organizer budaya pop Jepang terdepan di Indonesia Timur yang menghadirkan pengalaman komunitas yang inklusif dan berkesan.',
      missionList: [
        'Menyelenggarakan event budaya pop Jepang berkualitas tinggi secara berkala',
        'Membangun jaringan komunitas penggemar budaya pop Jepang di Makassar',
        'Memberikan wadah bagi talenta lokal untuk tampil dan berkembang',
        'Memperkenalkan budaya pop Jepang kepada masyarakat luas',
      ],
    },
  });
  console.log('✓ About content seeded');

  console.log('\n🎉 Seed selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
