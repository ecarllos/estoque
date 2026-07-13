import { Injectable } from '@nestjs/common';
import { EletronicoQuery } from '../repository/query.repo';
import { listarEletronicosDto } from '../dto/listar-eletronicos.dto';

@Injectable()
export class ListarEletronicosUseCase {
  constructor(private readonly query: EletronicoQuery) {}

  async execute(dto: listarEletronicosDto) {
    return await this.query.listarEletronicos(dto.paginas, dto.limite);
  }
}
