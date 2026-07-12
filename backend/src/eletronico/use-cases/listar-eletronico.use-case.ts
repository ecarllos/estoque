import { Injectable } from '@nestjs/common';
import { EletronicoQuery } from '../repository/query.repo';
import { listarEletronicosDto } from '../dto/listar-eletronicos.dto';

@Injectable()
export class ListarEletronicosUseCase {
  constructor(private readonly query: EletronicoQuery) {}

  async execute(dto: listarEletronicosDto) {
    const paginas = dto.paginas;
    const limite = dto.limite;
    const pular = (paginas - 1) * limite;

    return await this.query.listarEletronicos(pular, limite);
  }
}
