import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VinculoCommand } from '../repository/command.repo';
import { VinculoQuery } from '../repository/query.repo';
import { ResponsavelQuery } from '@/responsavel/repository/query.repo';
import { EletronicoQuery } from '@/eletronico/repository/query.repo';
import { CreateVinculoDto } from '../dto/create/createVinculo.dto';

@Injectable()
export class CriarVinculoUseCase {
  constructor(
    private readonly command: VinculoCommand,
    private readonly query: VinculoQuery,
    private readonly queryResponsavel: ResponsavelQuery,
    private readonly queryObjeto: EletronicoQuery,
  ) {}

  // verificar se o id do objeto existe
  // verificar se a situação do objeto = 'LIVRE'
  // verificar ser o Responsavel tem o status = true
  // verificar se o objeto já possui algum vínculo (status === 'OCUPADO', vinculoId === true)

  async execute(dto: CreateVinculoDto) {
    const objeto = await this.queryObjeto.listarUmEletronico(dto.objetoId);
    const responsavel = await this.queryResponsavel.buscarId(
      dto.responsavelId,
      { select: { status: true } },
    );

    console.log(objeto);

    if (!objeto) {
      throw new NotFoundException('Id do objeto informado não existe');
    }
    if (!responsavel) {
      throw new NotFoundException('Id o responsavel iinformado não existe');
    }
    if (objeto.situacao !== 'LIVRE') {
      throw new ConflictException('O objeto não está livre no estoque');
    }
    if (objeto.vinculoId !== null) {
      throw new ConflictException('O objeto já está cadastrado em um vínculo');
    }
    if (!responsavel.status) {
      throw new ConflictException('O responsavel não está ativo');
    }

    return await this.command.createVinculo(dto);
  }
}
