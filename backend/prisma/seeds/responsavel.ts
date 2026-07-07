import { PrismaClient } from '@prisma/client';

export async function seedResponsavel(prisma: PrismaClient) {
  console.log('👥 Iniciando seed de Responsáveis');
  const responsavel = await prisma.responsavel.upsert({
    where: { email: 'joao@gmail.com' },
    update: {},
    create: {
      nome: 'Joao',
      email: 'joao@gmail.com',
      setor: 'RELACIONAMENTO',
      cidade: 'FORTALEZA',
      status: true,
    },
  });

  return responsavel;
}
