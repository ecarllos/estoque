import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ResponsavelQuery {
  constructor(private readonly prisma: PrismaService) {}

  async buscarEmail(email: string) {
    return await this.prisma.responsavel.findUnique({ where: { email } });
  }

  async mostrarResponsavel(email: string) {
    return await this.prisma.responsavel.findUnique({
      where: { email },
      include: {},
    });
  }
}
