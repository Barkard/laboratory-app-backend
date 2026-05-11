const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { id_user: true, first_name: true, last_name: true, id_role: true }
    });
    console.log('--- Users ---');
    users.forEach(u => console.log(`ID: ${u.id_user} | ${u.first_name} ${u.last_name} | Role: ${u.id_role}`));

    const notifications = await prisma.notification.findMany({
      orderBy: { created_at: 'desc' },
      take: 20
    });
    console.log('\n--- Recent Notifications ---');
    notifications.forEach(n => {
      const user = users.find(u => u.id_user === n.id_user);
      const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown';
      console.log(`[ID:${n.id_notification}] To: ${userName} (ID:${n.id_user}) | Title: ${n.title} | Msg: ${n.message}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
