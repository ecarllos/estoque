import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EletronicoQuery {
  constructor(private readonly prisma: PrismaService) {}

  async listarEletronicos(pular: number, limite: number) {
    return await this.prisma.eletronico.findMany({
      skip: pular,
      take: limite,
      include: {
        vinculo: {
          select: {
            id: true,
            status: true,
            responsavel: { select: { nome: true, email: true } },
          },
        },
      },
    });
  }
}
