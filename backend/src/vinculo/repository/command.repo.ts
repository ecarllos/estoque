import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateVinculoDto } from '../dto/create/createVinculo.dto';

@Injectable()
export class VinculoCommand {
  constructor(private readonly prisma: PrismaService) {}

  async createVinculo(dto: CreateVinculoDto) {
    const tipoObjeto = dto.tipoObjeto;

    return await this.prisma.$transaction(async (tx) => {
      const createVinculo = await tx.vinculo.create({
        data: {
          status: true,
          responsavelId: dto.responsavelId,
          detalhes: dto.detalhes,
        },
      });

      const createHistorico = await tx.historicoObjeto.create({
        data: {
          vinculoId: createVinculo.id,
          responsavelId: dto.responsavelId,
          condicao: dto.historico.condicao,
          acao: 'ENTREGUE',
          detalhes: dto.detalhes,
        },
      });

      switch (tipoObjeto) {
        case 'ELETRONICO': {
          await tx.eletronico.update({
            where: { id: dto.objetoId },
            data: {
              situacao: 'OCUPADO',
              vinculoId: createVinculo.id,
            },
          });
          break;
        }

        case 'PERIFERICO': {
          await tx.periferico.update({
            where: { id: dto.objetoId },
            data: {
              situacao: 'OCUPADO',
              vinculoId: createVinculo.id,
            },
          });
          break;
        }

        case 'CHIP': {
          await tx.chip.update({
            where: { id: dto.objetoId },
            data: {
              situacao: 'OCUPADO',
              vinculoId: createVinculo.id,
            },
          });
          break;
        }
      }

      return {
        createVinculo,
        createHistorico,
      };
    });
  }
}
