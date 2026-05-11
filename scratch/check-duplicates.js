const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const duplicates = await prisma.user.groupBy({
    by: ['phone'],
    _count: {
      phone: true,
    },
    having: {
      phone: {
        _count: {
          gt: 1,
        },
      },
    },
  });

  if (duplicates.length > 0) {
    console.log('--- Se encontraron números de teléfono duplicados ---');
    for (const dup of duplicates) {
      const users = await prisma.user.findMany({
        where: { phone: dup.phone },
        select: { id_user: true, first_name: true, last_name: true, phone: true }
      });
      console.log(`Teléfono: ${dup.phone} (${dup._count.phone} usuarios)`);
      users.forEach(u => console.log(`  - ID: ${u.id_user}: ${u.first_name} ${u.last_name}`));
    }
  } else {
    console.log('No se encontraron números de teléfono duplicados. ¡Puedes migrar!');
  }
}

main().finally(() => prisma.$disconnect());
