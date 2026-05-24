const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NexusDesk...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexusdesk.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@nexusdesk.com', password: await bcrypt.hash('admin123', 10), role: 'ADMIN' },
  });

  const tech = await prisma.user.upsert({
    where: { email: 'tecnico@nexusdesk.com' },
    update: {},
    create: { name: 'Rafael Torres', email: 'tecnico@nexusdesk.com', password: await bcrypt.hash('tech123', 10), role: 'TECHNICIAN' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'usuario@nexusdesk.com' },
    update: {},
    create: { name: 'Carlos Mendes', email: 'usuario@nexusdesk.com', password: await bcrypt.hash('user123', 10), role: 'USER' },
  });

  await prisma.ticket.createMany({
    data: [
      { title: 'Servidor de produção fora do ar', description: 'O servidor parou de responder às 09:14.', status: 'OPEN', priority: 'CRITICAL', userId: user.id, assignedTo: tech.id },
      { title: 'VPN não conecta após update', description: 'Erro de autenticação após atualizar cliente VPN.', status: 'IN_PROGRESS', priority: 'HIGH', userId: user.id, assignedTo: tech.id },
      { title: 'Impressora offline no 3° andar', description: 'Impressora HP aparece offline.', status: 'IN_PROGRESS', priority: 'MEDIUM', userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed concluído!');
  console.log('Admin:    admin@nexusdesk.com   / admin123');
  console.log('Técnico:  tecnico@nexusdesk.com / tech123');
  console.log('Usuário:  usuario@nexusdesk.com / user123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
