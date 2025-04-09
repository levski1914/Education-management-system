import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  await prisma.school.createMany({
    data: [
      { name: 'СОУ Ала Бала', city: 'Варна' },
      { name: 'ПМГ Гениите', city: 'Пловдив' },
    ],
  });
  await prisma.user.createMany({
    data: [
      {
        email: 'parent@example.com',
        password,
        role: 'PARENT',
      },
      {
        email: 'teacher@example.com',
        password,
        role: 'TEACHER',
      },
      {
        email: 'admin@example.com',
        password,
        role: 'ADMIN',
      },
      {
        email: 'superadmin@example.com',
        password,
        role: 'SUPERADMIN',
      },
    ],

    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log('seed completed');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
