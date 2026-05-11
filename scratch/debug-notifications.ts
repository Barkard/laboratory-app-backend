import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const notifications = await prisma.notification.findMany({
    include: {
      user: {
        select: {
          id_user: true,
          first_name: true,
          last_name: true,
          id_role: true
        }
      }
    }
  });

  console.log('--- Notifications in DB ---');
  notifications.forEach(n => {
    console.log(`ID: ${n.id_notification} | User: ${n.user.first_name} ${n.user.last_name} (ID: ${n.id_user}, Role: ${n.user.id_role}) | Msg: ${n.message}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
