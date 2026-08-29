import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const newPlainPassword = process.argv[2];
  const username = process.env.ADMIN_USERNAME || 'admin';

  let passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (newPlainPassword) {
    console.log(`\n🔑 Melakukan hashing password baru...`);
    passwordHash = await bcrypt.hash(newPlainPassword, 10);
    console.log(`\n📋 Hash Baru untuk .env:`);
    console.log(`ADMIN_PASSWORD_HASH=${passwordHash}\n`);
  } else if (!passwordHash) {
    console.error('❌ Harap berikan password baru sebagai argumen:');
    console.error('   npx tsx scripts/set-password.ts <password_baru>');
    process.exit(1);
  }

  const updatedUser = await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`✅ Berhasil memperbarui password di database untuk user: "${updatedUser.username}" (ID: ${updatedUser.id})`);
}

main()
  .catch((err) => {
    console.error('❌ Terjadi kesalahan:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
