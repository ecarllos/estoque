import { Injectable } from '@nestjs/common';
import { ResponsavelQuery } from '../repository/query.repo';
import { ListarMuitosDto } from '@/common/listar-muitos.dto';

@Injectable()
export class ListarTodosResponsaveis {
  constructor(private readonly query: ResponsavelQuery) {}

  async execute(dto: ListarMuitosDto) {
    const listar = await this.query.listarTodosResponsaveis(dto);

    return listar;
  }
}
