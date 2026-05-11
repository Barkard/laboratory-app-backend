import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Iniciando Seeding de Base de Datos ---');

  // 1. Roles
  const roles = [
    { id_role: 1, name: 'Administrador' },
    { id_role: 2, name: 'Supervisor' },
    { id_role: 3, name: 'Paciente' },
  ];

  console.log('Sembrando roles...');
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id_role: role.id_role },
      update: { name: role.name },
      create: role,
    });
  }

  // 2. Usuarios base (Admin)
  const users = [
    {
      uid: 'AntonioSalasAdmin',
      email: 'leon@gmail.com',
      first_name: 'Antonio',
      last_name: 'Salas',
      phone: '04141234567',
      id_role: 1,
    },
    {
      uid: '33703227',
      email: 'sebas@gmai.com',
      first_name: 'Sebas',
      last_name: 'Tian',
      phone: '04147417971',
      id_role: 2,
    },
  ];

  console.log('Sembrando usuarios base...');
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  console.log('--- Seeding completado con éxito ---');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
