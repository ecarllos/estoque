/* eslint-disable prettier/prettier */
import { PrismaClient, Aparelhos, Marcas, Status, Condicao, Cidades } from '@prisma/client';

export async function seedEletronico(prisma: PrismaClient) {
  const listaEletronicos = [
    { tipo: Aparelhos.NOTEBOOK, numeroSerie: 'NTB-001', marca: Marcas.LENOVO, modelo: 'Latitude 3420', situacao: Status.OCUPADO, seguro: true, condicao: Condicao.NOVO, cidade: Cidades.FORTALEZA },
    { tipo: Aparelhos.CELULAR, numeroSerie: 'CEL-002', marca: Marcas.SAMSUNG, modelo: 'Galaxy S23', situacao: Status.OCUPADO, seguro: false, condicao: Condicao.USADO, cidade: Cidades.JOINVILLE },
    { tipo: Aparelhos.TABLET, numeroSerie: 'TAB-003', marca: Marcas.SAMSUNG, modelo: 'iPad Air', situacao: Status.LIVRE, seguro: true, condicao: Condicao.NOVO, cidade: Cidades.FORTALEZA },
    { tipo: Aparelhos.NOTEBOOK, numeroSerie: 'NTB-004', marca: Marcas.LENOVO, modelo: 'ThinkPad T14', situacao: Status.OCUPADO, seguro: true, condicao: Condicao.SEMI_NOVO, cidade: Cidades.JOINVILLE },
    { tipo: Aparelhos.CELULAR, numeroSerie: 'CEL-005', marca: Marcas.SAMSUNG, modelo: 'iPhone 13', situacao: Status.OCUPADO, seguro: false, condicao: Condicao.USADO, cidade: Cidades.FORTALEZA },
    { tipo: Aparelhos.NOTEBOOK, numeroSerie: 'NTB-006', marca: Marcas.LENOVO, modelo: 'Inspiron 15', situacao: Status.LIVRE, seguro: true, condicao: Condicao.NOVO, cidade: Cidades.JOINVILLE },
    { tipo: Aparelhos.CELULAR, numeroSerie: 'CEL-007', marca: Marcas.SAMSUNG, modelo: 'Galaxy A54', situacao: Status.OCUPADO, seguro: false, condicao: Condicao.NOVO, cidade: Cidades.FORTALEZA },
    { tipo: Aparelhos.NOTEBOOK, numeroSerie: 'NTB-008', marca: Marcas.SAMSUNG, modelo: 'MacBook Pro M2', situacao: Status.OCUPADO, seguro: true, condicao: Condicao.NOVO, cidade: Cidades.JOINVILLE },
    { tipo: Aparelhos.TABLET, numeroSerie: 'TAB-009', marca: Marcas.SAMSUNG, modelo: 'Galaxy Tab S8', situacao: Status.LIVRE, seguro: false, condicao: Condicao.USADO, cidade: Cidades.FORTALEZA },
    { tipo: Aparelhos.CELULAR, numeroSerie: 'CEL-010', marca: Marcas.SAMSUNG, modelo: 'iPhone 14 Pro', situacao: Status.OCUPADO, seguro: true, condicao: Condicao.NOVO, cidade: Cidades.JOINVILLE },
    { tipo: Aparelhos.NOTEBOOK, numeroSerie: 'NTB-011', marca: Marcas.LENOVO, modelo: 'IdeaPad 3', situacao: Status.OCUPADO, seguro: false, condicao: Condicao.NOVO, cidade: Cidades.FORTALEZA },
    { tipo: Aparelhos.CELULAR, numeroSerie: 'CEL-012', marca: Marcas.SAMSUNG, modelo: 'Galaxy S21 FE', situacao: Status.LIVRE, seguro: false, condicao: Condicao.SEMI_NOVO, cidade: Cidades.JOINVILLE },
  ];

  console.log('💻 Iniciando seed de Eletrônicos...');
  
  for (const item of listaEletronicos) {
    const eletronico = await prisma.eletronico.upsert({
      where: { numeroSerie: item.numeroSerie },
      update: {},
      create: {
        tipo: item.tipo,
        numeroSerie: item.numeroSerie,
        marca: item.marca,
        modelo: item.modelo,
        situacao: item.situacao,
        seguro: item.seguro,
        condicao: item.condicao,
        cidade: item.cidade,
      },
    });

    console.log(`Eletrônico ${eletronico.numeroSerie} criado com Sucesso`);
  }
}