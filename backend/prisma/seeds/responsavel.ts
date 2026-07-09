import { Cidades, PrismaClient, Setores } from '@prisma/client';

export async function seedResponsavel(prisma: PrismaClient) {
  const listaResponsavel = [
    {
      nome: 'Caique',
      email: 'caique@gmail.com',
      setor: Setores.COMERCIAL,
      cidade: Cidades.JOAO_PESSOA,
      status: false,
    },
    {
      nome: 'Daniel',
      email: 'daniel@gmail.com',
      setor: Setores.BACKOFFICE,
      cidade: Cidades.FORTALEZA,
      status: true,
    },
    {
      nome: 'Cleidiande',
      email: 'cleide@gmail.com',
      setor: Setores.ADMINISTRATIVO,
      cidade: Cidades.FORTALEZA,
      status: true,
    },
    {
      nome: 'Eduardo',
      email: 'edu@gmail.com',
      setor: Setores.TI,
      cidade: Cidades.FORTALEZA,
      status: true,
    },
    {
      nome: 'Rayssa',
      email: 'rayssa@gmail.com',
      setor: Setores.COMERCIAL,
      cidade: Cidades.JUAZEIRO,
      status: true,
    },
    {
      nome: 'Thais',
      email: 'thais@gmail.com',
      setor: Setores.RELACIONAMENTO,
      cidade: Cidades.JOINVILLE,
      status: true,
    },
  ];

  console.log('👥 Iniciando seed de Responsáveis');
  for (const item of listaResponsavel) {
    const responsavel = await prisma.responsavel.upsert({
      where: { email: item.email },
      update: {},
      create: {
        nome: item.nome,
        email: item.email,
        setor: item.setor,
        cidade: item.cidade,
        status: item.status,
      },
    });

    console.log(`Reponsavel ${responsavel.nome} criado com Sucesso`);
  }
}
