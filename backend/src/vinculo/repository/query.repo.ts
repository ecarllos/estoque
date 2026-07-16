/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BaseQuery } from '@/common/BaseQuery.common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Vinculo } from '@prisma/client';

@Injectable()
export class VinculoQuery extends BaseQuery<Vinculo> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.vinculo);
  }

  async buscarVinculo(id: string) {
    return await this.listarPorId(id);
  }
}
