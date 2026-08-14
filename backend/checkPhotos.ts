import 'dotenv/config';
import { prisma } from './src/utils/prisma';

async function main() {
  console.log('Events:', await prisma.event.findMany({ select: { name: true, posterImageUrl: true, heroImageUrl: true } }));
  console.log('Talents:', await prisma.talent.findMany({ select: { stageName: true, profileImageUrl: true } }));
  console.log('Communities:', await prisma.community.findMany({ select: { name: true, logoUrl: true } }));
  console.log('Programs:', await prisma.program.findMany({ select: { name: true, coverImageUrl: true } }));
}

main().catch(console.error).finally(() => prisma.$disconnect());
