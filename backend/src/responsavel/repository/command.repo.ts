import { Injectable } from '@nestjs/common';
import { CreateResponsavelDto } from '../dto/create-responsavel.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateResponsavelDto } from '../dto/update-responsavel.dto';

@Injectable()
export class ResponsavelCommand {
  constructor(private readonly prisma: PrismaService) {}

  async createResponsavel(dto: CreateResponsavelDto) {
    return await this.prisma.responsavel.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        setor: dto.setor,
        cidade: dto.cidade,
        status: dto.status,
      },
    });
  }

  async updateResponsavel(id: string, dto: UpdateResponsavelDto) {
    return await this.prisma.responsavel.update({
      where: { id },
      data: {
        nome: dto.nome,
        email: dto.email,
        setor: dto.setor,
        cidade: dto.cidade,
        status: dto.status,
      },
    });
  }

  async deleteResponsavel(id: string) {
    return await this.prisma.responsavel.delete({
      where: { id },
    });
  }
}
