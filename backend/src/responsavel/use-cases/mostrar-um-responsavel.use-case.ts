import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponsavelQuery } from '../repository/query.repo';

@Injectable()
export class MostrarUmResponsavel {
  constructor(private readonly query: ResponsavelQuery) {}

  async execute(email: string) {
    const foundEmail = await this.query.buscarEmail(email);

    if (!foundEmail)
      throw new NotFoundException(`esse email não foi encontrado`);

    const mostrar = await this.query.mostrarResponsavel(email);

    return mostrar;
  }
}
