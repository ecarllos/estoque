import { BaseQuery } from '@/common/BaseQuery.common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Eletronico } from '@prisma/client';

@Injectable()
export class EletronicoQuery extends BaseQuery<Eletronico> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.eletronico);
  }

  async listarEletronicos(paginas: number, limite: number) {
    return await this.listarPaginado(paginas, limite, {
      include: {
        vinculo: {
          select: {
            id: true,
            status: true,
            responsavel: {
              select: { nome: true },
            },
          },
        },
      },
    });
  }
}
