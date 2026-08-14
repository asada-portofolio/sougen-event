import 'dotenv/config';
import { prisma } from './prisma';

async function main() {
  console.log('Seeding dummy event...');

  // 1. Create Talents
  const guest = await prisma.talent.upsert({
    where: { slug: 'guest-dummy' },
    update: {},
    create: {
      slug: 'guest-dummy',
      stageName: 'Hatsune Miku',
      tag: 'Virtual Singer',
      bio: 'The most popular virtual singer in the world.',
      instagramUrl: 'https://instagram.com/cfm_miku_official',
      followerCount: 1500000,
    }
  });

  const performer = await prisma.talent.upsert({
    where: { slug: 'performer-dummy' },
    update: {},
    create: {
      slug: 'performer-dummy',
      stageName: 'Local Idol Group',
      tag: 'Idol Group',
      bio: 'Local idol group ready to hype the stage.',
    }
  });

  // 2. Create Program
  const program1 = await prisma.program.upsert({
    where: { slug: 'cosplay-comp-dummy' },
    update: {},
    create: {
      slug: 'cosplay-comp-dummy',
      name: 'Cosplay Competition',
      description: 'Show your best costume and performance!',
      rulesHtml: '<p>Rule 1: No weapons.</p><p>Rule 2: Have fun!</p>',
    }
  });

  const program2 = await prisma.program.upsert({
    where: { slug: 'singing-comp-dummy' },
    update: {},
    create: {
      slug: 'singing-comp-dummy',
      name: 'Anisong Singing Competition',
      description: 'Sing your favorite anime songs.',
    }
  });

  // 3. Create Event
  const event = await prisma.event.upsert({
    where: { slug: 'summer-festival-2027' },
    update: {},
    create: {
      slug: 'summer-festival-2027',
      name: 'Summer Festival 2027',
      theme: 'Matsuri Vibe',
      startDate: new Date('2027-08-15T10:00:00Z'),
      endDate: new Date('2027-08-16T22:00:00Z'),
      location: 'Grand Convention Center, City',
      heroMode: 'TEMPLATE',
      isActive: true,
      googleDriveUrl: 'https://drive.google.com/drive/folders/dummy',
    }
  });

  // 4. Link Talents
  await prisma.eventTalent.upsert({
    where: { eventId_talentId: { eventId: event.id, talentId: guest.id } },
    update: {},
    create: {
      eventId: event.id,
      talentId: guest.id,
      role: 'GUEST',
    }
  });

  await prisma.eventTalent.upsert({
    where: { eventId_talentId: { eventId: event.id, talentId: performer.id } },
    update: {},
    create: {
      eventId: event.id,
      talentId: performer.id,
      role: 'PERFORMER',
      performTime: '15:00',
    }
  });

  // 5. Link Programs
  await prisma.eventProgram.upsert({
    where: { eventId_programId: { eventId: event.id, programId: program1.id } },
    update: { registrationUrl: 'https://forms.gle/dummy1' },
    create: {
      eventId: event.id,
      programId: program1.id,
      registrationUrl: 'https://forms.gle/dummy1',
      displayOrder: 1,
    }
  });

  await prisma.eventProgram.upsert({
    where: { eventId_programId: { eventId: event.id, programId: program2.id } },
    update: { registrationUrl: null },
    create: {
      eventId: event.id,
      programId: program2.id,
      displayOrder: 2,
    }
  });

  // 6. Create Event Days & Rundown
  const day1 = await prisma.eventDay.upsert({
    where: { eventId_dayNumber: { eventId: event.id, dayNumber: 1 } },
    update: {},
    create: {
      eventId: event.id,
      dayNumber: 1,
      date: new Date('2027-08-15T10:00:00Z'),
    }
  });

  await prisma.rundownItem.createMany({
    data: [
      { eventDayId: day1.id, time: '10:00 - 11:00', activityName: 'Open Gate & Registrasi', displayOrder: 1 },
      { eventDayId: day1.id, time: '11:00 - 13:00', activityName: 'Cosplay Competition', displayOrder: 2 },
      { eventDayId: day1.id, time: '13:00 - 15:00', activityName: 'Anisong Competition', displayOrder: 3 },
      { eventDayId: day1.id, time: '15:00 - 17:00', activityName: 'Special Guest Performance', displayOrder: 4 },
    ],
    skipDuplicates: true,
  });

  const day2 = await prisma.eventDay.upsert({
    where: { eventId_dayNumber: { eventId: event.id, dayNumber: 2 } },
    update: {},
    create: {
      eventId: event.id,
      dayNumber: 2,
      date: new Date('2027-08-16T10:00:00Z'),
    }
  });

  await prisma.rundownItem.createMany({
    data: [
      { eventDayId: day2.id, time: '10:00 - 12:00', activityName: 'Free Play & Community Gather', displayOrder: 1 },
      { eventDayId: day2.id, time: '12:00 - 15:00', activityName: 'Awarding', displayOrder: 2 },
      { eventDayId: day2.id, time: '15:00 - 17:00', activityName: 'Closing Ceremony', displayOrder: 3 },
    ],
    skipDuplicates: true,
  });

  console.log('Dummy event created successfully! Check it at /events/summer-festival-2027');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
