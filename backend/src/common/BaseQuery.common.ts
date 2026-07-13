/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */

export abstract class BaseQuery<T> {
  constructor(protected prismaService: any) {}

  async listarPaginado(
    paginas: number,
    limite: number,
    opcoes?: any,
  ): Promise<{ dados?: T[]; meta?: any }> {
    const pular = (paginas - 1) * limite;

    const find = await this.prismaService.findMany({
      skip: pular,
      take: limite,
      ...opcoes,
    });

    const count = await this.prismaService.count();
    const totalPaginas = Math.ceil(count / limite);

    return {
      dados: find,
      meta: {
        totalRegistros: count,
        paginaAtual: paginas,
        limitePorPagina: limite,
        totalPaginas,
      },
    };
  }
  async listarPorId(id: string) {
    return await this.prismaService.findUnique({
      where: { id },
    });
  }
}
