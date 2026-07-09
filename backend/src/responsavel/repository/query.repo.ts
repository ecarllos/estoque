import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ListarResponsaveisDto } from '../dto/listar-responsaveis.dto';

@Injectable()
export class ResponsavelQuery {
  constructor(private readonly prisma: PrismaService) {}

  async buscarId(id: string) {
    return await this.prisma.responsavel.findUnique({
      where: { id },
      select: { email: true },
    });
  }

  async buscarEmail(email: string) {
    return await this.prisma.responsavel.findUnique({
      where: { email },
      select: { email: true },
    });
  }

  async mostrarResponsavel(email: string) {
    return await this.prisma.responsavel.findUnique({ where: { email } });
  }

  async listarTodosResponsaveis(dto: ListarResponsaveisDto) {
    const paginas = dto.paginas;
    const limite = dto.limite;
    const pular = (paginas - 1) * limite;
    console.log(limite);

    return await this.prisma.responsavel.findMany({
      skip: pular,
      take: limite,
      include: {
        vinculos: {
          select: {
            id: true,
            status: true,
            eletronicos: true,
            perifericos: true,
            chips: true,
          },
        },
        historico: {
          select: {
            id: true,
            vinculoId: true,
            condicao: true,
            acao: true,
            detalhes: true,
            createAt: true,
          },
        },
      },
    });
  }
}
