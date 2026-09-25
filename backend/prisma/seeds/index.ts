import { prisma } from './client';
import { seedEletronico } from './eletronico';
import { seedResponsavel } from './responsavel';

async function main() {
  try {
    console.log('🌱 Iniciando população do banco de dados...\n');

    // 1. Responsável
    await seedResponsavel(prisma);
    // 2. Eletrônico
    await seedEletronico(prisma);
  } catch (error) {
    console.error('❌ Erro durante a population:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export { main };

if (require.main === module) {
  main().catch((error) => {
    console.log(error);
    process.exit(1);
  });
}
