import { Injectable } from '@nestjs/common';
import { ResponsavelQuery } from '../repository/query.repo';
import { ListarResponsaveisDto } from '../dto/listar-responsaveis.dto';

@Injectable()
export class ListarTodosResponsaveis {
  constructor(private readonly query: ResponsavelQuery) {}

  async execute(dto: ListarResponsaveisDto) {
    const listar = await this.query.listarTodosResponsaveis(dto);

    return listar;
  }
}
