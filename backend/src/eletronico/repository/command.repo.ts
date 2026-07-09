import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CriarEletronicoDto } from '../dto/criar-eletronico.dto';

@Injectable()
export class EletronicoCommand {
  constructor(private readonly prisma: PrismaService) {}

  async createEletronico(dto: CriarEletronicoDto) {
    return await this.prisma.eletronico.create({
      data: dto,
    });
  }
}
