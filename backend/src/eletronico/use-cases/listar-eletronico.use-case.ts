import { Injectable } from '@nestjs/common';
import { EletronicoQuery } from '../repository/query.repo';
import { ListarMuitosDto } from '@/common/listar-muitos.dto';

@Injectable()
export class ListarEletronicosUseCase {
  constructor(private readonly query: EletronicoQuery) {}

  async execute(dto: ListarMuitosDto) {
    return await this.query.listarEletronicos(dto.paginas, dto.limite);
  }
}
