import { Injectable } from '@nestjs/common';
import { CreateResponsavelDto } from '../dto/create-responsavel.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateResponsavelDto } from '../dto/update-responsavel.dto';

@Injectable()
export class ResponsavelCommand {
  constructor(private readonly prisma: PrismaService) {}

  async createResponsavel(dto: CreateResponsavelDto) {
    return await this.prisma.responsavel.create({
      data: dto,
    });
  }

  async updateResponsavel(id: string, dto: UpdateResponsavelDto) {
    return await this.prisma.responsavel.update({
      where: { id },
      data: dto,
    });
  }

  async deleteResponsavel(id: string) {
    return await this.prisma.responsavel.delete({
      where: { id },
    });
  }
}
