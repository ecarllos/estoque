# Casos de Uso do Sistema (Use Cases Specification)
## Katrix Estoque · Sistema de Gestão de Ativos de TI

> **Versão:** 2.0.0  
> **Data:** 2026-08-26  
> **Status:** Casos de Uso Atualizados (Arquitetura TPT com Utensilio & RBAC Híbrido)  
> **Autores:** Product Owner Sênior & Arquiteto de Software  
> **Documentos de Referência:** [PRD](PRD.md) | [SRS](SRS.md) | [Modelo de Dados](Modelo_de_Dados.md)

---

## Sumário

1. [Introdução e Visão Geral](#1-introdução-e-visão-geral)
2. [Catálogo de Regras de Negócio (RN)](#2-catálogo-de-regras-de-negócio-rn)
3. [Mapeamento de Atores](#3-mapeamento-de-atores)
4. [Especificação dos Casos de Uso do MVP](#4-especificação-dos-casos-de-uso-do-mvp)
   - [UC-01: Cadastrar Responsável](#uc-01-cadastrar-responsável)
   - [UC-02: Atualizar Dados do Responsável](#uc-02-atualizar-dados-do-responsável)
   - [UC-03: Inativar Responsável (Soft Delete)](#uc-03-inativar-responsável-soft-delete)
   - [UC-04: Cadastrar Ativo Eletrônico (TPT)](#uc-04-cadastrar-ativo-eletrônico-tpt)
   - [UC-05: Cadastrar Chip Telefônico (TPT)](#uc-05-cadastrar-chip-telefônico-tpt)
   - [UC-06: Cadastrar Periférico (TPT)](#uc-06-cadastrar-periférico-tpt)
   - [UC-07: Criar Vínculo de Ativo (Entrega / Empréstimo Unificado)](#uc-07-criar-vínculo-de-ativo-entrega--empréstimo-unificado)
   - [UC-08: Registrar Devolução de Ativo (Encerramento de Vínculo)](#uc-08-registrar-devolução-de-ativo-encerramento-de-vínculo)
   - [UC-09: Consultar Linha do Tempo e Histórico do Ativo](#uc-09-consultar-linha-do-tempo-e-histórico-do-ativo)
   - [UC-10: Autenticação de Operador (Login via JWT com Checagem de Ativo)](#uc-10-autenticação-de-operador-login-via-jwt-com-checagem-de-ativo)
   - [UC-11: Atribuir Exceção Granular de Permissão (PermissaoUser)](#uc-11-atribuir-exceção-granular-de-permissão-permissaouser)
   - [UC-12: Listar Ativos em Estoque com Paginação e Filtros](#uc-12-listar-ativos-em-estoque-com-paginação-e-filtros)
5. [Matriz de Rastreabilidade e Cobertura BDD](#5-matriz-de-rastreabilidade-e-cobertura-bdd)

---

## 1. Introdução e Visão Geral

Este documento formaliza todos os **Casos de Uso (Use Cases)** do sistema **Katrix Estoque**, atualizados para operar sobre a arquitetura relacional **Table-per-Type (TPT)** com a entidade base `Utensilio` e o modelo **RBAC Híbrido** nativo em banco (`PermissaoRole` e `PermissaoUser`).

---

## 2. Catálogo de Regras de Negócio (RN)

| ID | Nome da Regra | Descrição Técnica e Arquitetural |
|---|---|---|
| **RN-01** | Unicidade de E-mail de Responsável | O e-mail corporativo do responsável deve ser estritamente único no sistema (`Responsavel.email UNIQUE`). |
| **RN-02** | Bloqueio de Custódia para Inativo | Um responsável com `status == false` não pode receber novos ativos de TI em nenhuma circunstância. |
| **RN-03** | Preservação Histórica (Soft Delete) | A exclusão de responsáveis é exclusivamente lógica (`status = false`). É proibido o `DELETE` físico de responsáveis com histórico. |
| **RN-04** | Unicidade de Serial Number (Eletrônicos) | O número de série (`numeroSerie`) de um eletrônico é único globalmente no banco (`Eletronico.numeroSerie UNIQUE`). |
| **RN-05** | Unicidade de Linha Telefônica (Chips) | O número do chip com DDD deve ser exclusivo no inventário (`Chip.numero UNIQUE`). |
| **RN-06** | Disponibilidade Prévia do Utensílio | Para ser vinculado, o item patrimonial deve possuir obrigatoriamente `Utensilio.situacao == 'LIVRE'`. |
| **RN-07** | Atomicidade Transacional de Vinculação (TPT) | A criação de um vínculo (`Vinculo`), atualização de `Utensilio.situacao = 'OCUPADO'` e gravação do evento `ENTREGUE` em `HistoricoObjeto` devem ocorrer dentro de uma única transação ACID (`$transaction`). |
| **RN-08** | Atomicidade Transacional de Devolução | O encerramento do vínculo (`status = false`), liberação do item (`Utensilio.situacao = 'LIVRE'`) e gravação do evento `DEVOLVIDO` devem ocorrer dentro de uma única transação ACID (`$transaction`). |
| **RN-09** | Imutabilidade do Histórico de Objeto | A tabela `HistoricoObjeto` é append-only. Não possui coluna `updateAt`, nem métodos de edição/remoção na camada de repositório ou API. |
| **RN-10** | Precedência no RBAC Híbrido | A validação de permissões obedece à ordem: (1) `PermissaoUser` (exceção direta do usuário) -> (2) `PermissaoRole` (permissões herdadas do cargo). |
| **RN-11** | Proteção Criptográfica de Credenciais | Toda senha de usuário de sistema (`Usuario.senha`) deve ser hasheada com Bcrypt (salt rounds >= 10) antes da persistência. |
| **RN-12** | Omissão de Dados Sensíveis | Hashes de senhas de usuários nunca podem ser serializados em payloads JSON de resposta da API (`@Exclude()`). |
| **RN-13** | Limite Rígido de Paginação | Listagens não podem retornar payloads irrestritos. O limite padrão é 10 itens e o teto máximo permitido por requisição é de 100 itens. |
| **RN-14** | Integridade de Vínculos Órfãos | Não é permitido apagar registros da tabela `Vinculo`. Vínculos são apenas finalizados com `status = false`. |
| **RN-15** | Integridade de Especialização TPT | Todo registro em `Eletronico`, `Chip` ou `Periferico` deve possuir obrigatoriamente um registro pai correspondente na tabela `Utensilio` compartilhando o mesmo identificador (`utensilioId = Utensilio.id`). |

---

## 3. Mapeamento de Atores

- **Analista de TI (Principal):** Operador diário de cadastros, entregas e devoluções.
- **Gestor de TI (Principal/Secundário):** Consulta relatórios e audita inventário.
- **Administrador (Principal):** Gerencia usuários, papéis e concede exceções em `PermissaoUser`.
- **Responsável (Passivo):** Colaborador detentor temporário da custódia física dos itens.
- **Prisma Engine / PostgreSQL:** Infraestrutura de persistência e garantia de transações ACID.

---

## 4. Especificação dos Casos de Uso do MVP

### UC-01: Cadastrar Responsável

- **ID e Nome:** `UC-01: Cadastrar Responsável`
- **Atores:** Analista de TI / Administrador, PostgreSQL / Prisma Engine.
- **Pré-condições:** Operador autenticado com permissão `responsavel:create`.
- **Pós-condições:** Registro criado em `Responsavel` com `status = true`.
- **Fluxo Principal:**
  1. Operador envia `POST /responsavel/create` (`nome`, `email`, `setor`, `cidade`, `status: true`).
  2. `CriarResponsavelUseCase` valida que o e-mail não existe no banco.
  3. `ResponsavelCommand` persiste o colaborador via `prisma.responsavel.create(...)`.
  4. Retorna HTTP `201 Created` com UUID gerado.
- **Fluxos de Exceção:** FE-01: E-mail duplicado -> 409 Conflict. FE-02: Dados inválidos -> 400 Bad Request.
- **Regras:** RN-01, RN-10.
- **Critérios BDD:**
  ```gherkin
  Cenário: Cadastro de responsável com sucesso
    DADO QUE o e-mail "carlos@empresa.com" não existe no banco
    QUANDO o Analista enviar "POST /responsavel/create" com dados válidos
    ENTÃO o colaborador deve ser cadastrado com status true e UUID válido
    E o status HTTP deve ser 201 Created.
  ```

---

### UC-02: Atualizar Dados do Responsável

- **ID e Nome:** `UC-02: Atualizar Dados do Responsável`
- **Atores:** Analista de TI / Administrador.
- **Fluxo Principal:** `PATCH /responsavel/:id` -> valida existência -> checa duplicidade de e-mail -> executa update.
- **Fluxos de Exceção:** ID inexistente (404), mesmo e-mail atual (400), e-mail de terceiro em uso (409).
- **Regras:** RN-01, RN-10.

---

### UC-03: Inativar Responsável (Soft Delete)

- **ID e Nome:** `UC-03: Inativar Responsável (Soft Delete)`
- **Fluxo Principal:** `DELETE /responsavel/:id` -> atualiza `Responsavel.status = false` preservando histórico intacto.
- **Regras:** RN-02, RN-03, RN-14.
---

### UC-04: Cadastrar Ativo Eletrônico (TPT)

- **ID e Nome:** `UC-04: Cadastrar Ativo Eletrônico (TPT)`
- **Atores:** Analista de TI, PostgreSQL / Prisma Engine.
- **Pré-condições:** Operador autenticado com permissão `eletronico:create`. Serial number físico disponível.
- **Pós-condições:** Registro em `Utensilio` (`categoria: ELETRONICO`, `situacao: LIVRE`) e em `Eletronico` (`utensilioId = Utensilio.id`) criados com sucesso.
- **Fluxo Principal (Caminho Feliz):**
  1. O Analista envia requisição `POST /eletronico/create` com: `tipo` (NOTEBOOK, CELULAR, TABLET), `numeroSerie`, `marca`, `modelo`, `senha` (opcional), `seguro`, `condicao`, `cidade`.
  2. O `ValidationPipe` valida o `CriarEletronicoDto`.
  3. O `CriarEletronicoUseCase` verifica unicidade do `numeroSerie`.
  4. O `EletronicoCommand` executa inserção atômica via Prisma nested write ou `$transaction`:
     ```ts
     await prisma.utensilio.create({
       data: {
         categoria: 'ELETRONICO',
         cidade: dto.cidade,
         situacao: 'LIVRE',
         condicao: dto.condicao,
         eletronico: {
           create: {
             tipo: dto.tipo,
             numeroSerie: dto.numeroSerie,
             marca: dto.marca,
             modelo: dto.modelo,
             senha: dto.senha,
             seguro: dto.seguro,
           },
         },
       },
     });
     ```
  5. Retorna o registro criado com status HTTP `201 Created`.
- **Fluxos de Exceção:** FE-01: Serial number duplicado -> 409 Conflict. FE-02: Dados inválidos -> 400 Bad Request.
- **Regras:** RN-04, RN-06, RN-15.
- **Critérios BDD:**
  ```gherkin
  Cenário: Cadastro de notebook com padrão TPT
    DADO QUE o Analista de TI informa serial único "LEN-SN-998877", marca "LENOVO", modelo "ThinkPad", seguro "true", condicao "NOVO" e cidade "FORTALEZA"
    QUANDO a requisição "POST /eletronico/create" for executada
    ENTÃO um registro base na tabela Utensilio deve ser criado com categoria "ELETRONICO" e situacao "LIVRE"
    E uma extensão na tabela Eletronico deve ser criada com o mesmo id no campo utensilioId
    E a resposta da API deve retornar status HTTP 201 Created.
  ```

---

### UC-05: Cadastrar Chip Telefônico (TPT)

- **ID e Nome:** `UC-05: Cadastrar Chip Telefônico (TPT)`
- **Atores:** Analista de TI, PostgreSQL / Prisma Engine.
- **Fluxo Principal:**
  1. Operador envia `POST /chip/create` (`operadora`, `ddd`, `numero`, `cidade`, `condicao`).
  2. Use Case valida unicidade do número telefônico.
  3. `ChipCommand` cria `Utensilio` (`categoria: CHIP`, `situacao: LIVRE`) + `Chip` (`utensilioId = Utensilio.id`).
  4. Retorna HTTP `201 Created`.
- **Fluxos de Exceção:** Linha telefônica já existente -> 409 Conflict.
- **Regras:** RN-05, RN-06, RN-15.

---

### UC-06: Cadastrar Periférico (TPT)

- **ID e Nome:** `UC-06: Cadastrar Periférico (TPT)`
- **Atores:** Analista de TI, PostgreSQL / Prisma Engine.
- **Fluxo Principal:**
  1. Operador envia `POST /periferico/create` (`tipo`, `marca`, `condicao`, `cidade`).
  2. `PerifericoCommand` cria `Utensilio` (`categoria: PERIFERICO`, `situacao: LIVRE`) + `Periferico` (`utensilioId = Utensilio.id`).
  3. Retorna HTTP `201 Created`.
- **Regras:** RN-06, RN-15.

---

### UC-07: Criar Vínculo de Ativo (Entrega / Empréstimo Unificado)

- **ID e Nome:** `UC-07: Criar Vínculo de Ativo (Entrega / Empréstimo Unificado)`
- **Atores:** Analista de TI, Responsável (Recebedor), PostgreSQL / Prisma Engine ($transaction).
- **Pré-condições:**
  1. Operador autenticado com permissão `vinculo:create`.
  2. O item patrimonial (`utensilioId`) deve existir e estar com `Utensilio.situacao == 'LIVRE'`.
  3. O responsável (`responsavelId`) deve existir e estar com `Responsavel.status == true`.
- **Pós-condições:**
  1. Registro em `Vinculo` criado com `status = true`, `responsavelId` e `utensilioId`.
  2. Registro em `HistoricoObjeto` gravado com `acao = 'ENTREGUE'`.
  3. `Utensilio.situacao` atualizado atomicamente para `OCUPADO`.
- **Fluxo Principal (Caminho Feliz):**
  1. O Analista envia requisição `POST /vinculo/create` com: `responsavelId`, `utensilioId`, `detalhes` (opcional) e `historico: { condicao, detalhes }`.
  2. O `CriarVinculoUseCase` consulta `UtensilioQuery.buscarPorId(dto.utensilioId)` e valida `situacao === 'LIVRE'`.
  3. O Use Case consulta `ResponsavelQuery.buscarId(dto.responsavelId)` e valida `status === true`.
  4. O Use Case invoca `VinculoCommand.createVinculo(dto)`.
  5. O `VinculoCommand` executa o bloco atômico `prisma.$transaction(async (tx) => { ... })`:
     a. `tx.vinculo.create({ data: { status: true, responsavelId, utensilioId, detalhes } })`;
     b. `tx.historicoObjeto.create({ data: { vinculoId, responsavelId, condicao, acao: 'ENTREGUE', detalhes } })`;
     c. `tx.utensilio.update({ where: { id: utensilioId }, data: { situacao: 'OCUPADO' } })`.
  6. A transação é efetivada (COMMIT) no PostgreSQL.
  7. O sistema retorna `{ createVinculo, createHistorico }` com HTTP `201 Created`.
- **Fluxos de Exceção:**
  - FE-01: Utensílio inexistente -> 404 Not Found.
  - FE-02: Responsável inexistente -> 404 Not Found.
  - FE-03: Utensílio já ocupado -> 409 Conflict ('O objeto não está livre no estoque').
  - FE-04: Responsável inativo -> 409 Conflict ('O responsavel não está ativo').
- **Regras:** RN-02, RN-06, RN-07, RN-09.
- **Critérios BDD:**
  ```gherkin
  Cenário: Vinculação de utensílio a colaborador ativo em transação ACID
    DADO QUE o utensílio "uuid-utensilio-1" possui situacao "LIVRE"
    E o responsável "Carlos TI" (ID "uuid-resp-1") possui status igual a true
    QUANDO o Analista enviar "POST /vinculo/create" associando "uuid-utensilio-1" a "uuid-resp-1"
    ENTÃO uma transação atômica deve ser executada no PostgreSQL
    E um registro em Vinculo deve ser criado com status true, responsavelId e utensilioId
    E um registro em HistoricoObjeto deve ser criado com ação "ENTREGUE"
    E a tabela Utensilio deve ter seu campo situacao atualizado para "OCUPADO"
    E a resposta da API deve retornar status HTTP 201 Created.
  ```

---

### UC-08: Registrar Devolução de Ativo (Encerramento de Vínculo)

- **ID e Nome:** `UC-08: Registrar Devolução de Ativo (Encerramento de Vínculo)`
- **Atores:** Analista de TI, Responsável (Devolvedor), PostgreSQL / Prisma Engine ($transaction).
- **Fluxo Principal (Caminho Feliz):**
  1. Analista envia `PATCH /vinculo/:id/devolver` (`condicao`, `detalhes`).
  2. Use Case busca o vínculo por ID e valida `vinculo.status === true`.
  3. `VinculoCommand` executa `prisma.$transaction`:
     a. `tx.vinculo.update({ where: { id: vinculoId }, data: { status: false } })`;
     b. `tx.historicoObjeto.create({ data: { vinculoId, responsavelId: vinculo.responsavelId, condicao, acao: 'DEVOLVIDO', detalhes } })`;
     c. `tx.utensilio.update({ where: { id: vinculo.utensilioId }, data: { situacao: 'LIVRE', condicao } })`.
  4. Transação confirmada com sucesso (COMMIT).
  5. Retorna HTTP `200 OK` confirmando a liberação do ativo.
- **Fluxos de Exceção:** Vínculo inexistente (404), vínculo já encerrado (409).
- **Regras:** RN-08, RN-09, RN-14.
---

### UC-09: Consultar Linha do Tempo e Histórico do Ativo

- **ID e Nome:** `UC-09: Consultar Linha do Tempo e Histórico do Ativo`
- **Atores:** Analista de TI / Gestor de TI, PostgreSQL / Prisma Engine.
- **Fluxo Principal:**
  1. Usuário envia `GET /historico/utensilio/:utensilioId`.
  2. `HistoricoQuery` busca os registros de `HistoricoObjeto` relacionados aos vínculos do `utensilioId`, trazendo dados do responsável e condição física no momento de cada ação ordenados por `createAt DESC`.
  3. Retorna array cronológico com HTTP `200 OK`.
- **Regras:** RN-09.

---

### UC-10: Autenticação de Operador (Login via JWT com Checagem de Ativo)

- **ID e Nome:** `UC-10: Autenticação de Operador (Login via JWT com Checagem de Ativo)`
- **Atores:** Usuário do Sistema, Bcrypt Engine, Passport / JwtService.
- **Pré-condições:** Usuário cadastrado na tabela `Usuario`.
- **Fluxo Principal:**
  1. Operador envia credenciais via `POST /auth/login` (`email`, `senha`).
  2. `LoginUseCase` busca o usuário e valida se `usuario.ativo === true`.
  3. Use Case valida a senha via `bcrypt.compare(...)`.
  4. Use Case emite JWT assinado contendo `sub` (userId), `email` e `roleId`.
  5. Retorna token e dados do usuário (omitindo a senha) com HTTP `200 OK`.
- **Fluxos de Exceção:** Credenciais inválidas ou usuário inativo (`ativo == false`) -> 401 Unauthorized ('Credenciais inválidas').
- **Regras:** RN-11, RN-12.

---

### UC-11: Atribuir Exceção Granular de Permissão (PermissaoUser)

- **ID e Nome:** `UC-11: Atribuir Exceção Granular de Permissão (PermissaoUser)`
- **Atores:** Administrador do Sistema, PostgreSQL / Prisma Engine.
- **Pré-condições:** Operador autenticado com permissão `usuario:manage`. Usuário e permissão existem.
- **Pós-condições:** Registro associativo criado em `PermissaoUser`, concedendo privilégio direto ao operador.
- **Fluxo Principal:**
  1. Administrador envia `POST /permissao/usuario/atribuir` (`userId`, `permissaoId`).
  2. Use Case persiste a concessão em `PermissaoUser` via `prisma.permissaoUser.create(...)`.
  3. `PermissionGuard` passa a autorizar o operador prioritariamente por `PermissaoUser`.
  4. Retorna HTTP `200 OK`.
- **Fluxos Alternativos:** `DELETE /permissao/usuario/revogar` remove a exceção em `PermissaoUser`.
- **Regras:** RN-10.

---

### UC-12: Listar Ativos em Estoque com Paginação e Filtros

- **ID e Nome:** `UC-12: Listar Ativos em Estoque com Paginação e Filtros`
- **Atores:** Analista de TI / Gestor de TI, PostgreSQL / Prisma Engine.
- **Fluxo Principal:**
  1. Operador requisita `GET /utensilio/listar?paginas=1&limite=10&categoria=ELETRONICO&situacao=LIVRE`.
  2. `UtensilioQuery` utiliza `BaseQuery<Utensilio>.listarPaginado()` incluindo especializações (`eletronico`, `chip`, `periferico`) e vínculos ativos.
  3. Retorna objeto `{ dados: Utensilio[], meta: { totalRegistros, paginaAtual, limitePorPagina, totalPaginas } }` com HTTP `200 OK`.
- **Regras:** RN-13.

---

## 5. Matriz de Rastreabilidade e Cobertura BDD

| Caso de Uso | Regras de Negócio | Endpoints Mapeados | Cenários BDD Cobertos |
|---|---|---|---|
| **UC-01: Cadastrar Responsável** | RN-01, RN-10 | `POST /responsavel/create` | Sucesso, e-mail duplicado (409), dados inválidos (400). |
| **UC-02: Atualizar Dados do Responsável** | RN-01, RN-10 | `PATCH /responsavel/:id` | Sucesso, ID inexistente (404), e-mail de terceiro em uso (409). |
| **UC-03: Inativar Responsável (Soft Delete)** | RN-02, RN-03, RN-14 | `DELETE /responsavel/:id` | Inativação lógica, tentativa de vínculo em inativo (409). |
| **UC-04: Cadastrar Eletrônico (TPT)** | RN-04, RN-06, RN-15 | `POST /eletronico/create` | Criação atômica Utensilio + Eletronico, serial duplicado (409). |
| **UC-05: Cadastrar Chip (TPT)** | RN-05, RN-06, RN-15 | `POST /chip/create` | Criação Utensilio + Chip, número duplicado (409). |
| **UC-06: Cadastrar Periférico (TPT)** | RN-06, RN-15 | `POST /periferico/create` | Criação Utensilio + Periferico, categoria mapeada. |
| **UC-07: Criar Vínculo Unificado (Entrega)** | RN-02, RN-06, RN-07, RN-09 | `POST /vinculo/create` | Transação ACID (Vinculo + Historico + Utensilio OCUPADO), 409 em ativo ocupado. |
| **UC-08: Registrar Devolução** | RN-08, RN-09, RN-14 | `PATCH /vinculo/:id/devolver` | Transação ACID (Vinculo false + Historico + Utensilio LIVRE), vínculo encerrado (409). |
| **UC-09: Consultar Histórico por Utensílio** | RN-09 | `GET /historico/utensilio/:id` | Linha do tempo completa ordenada cronologicamente por `createAt DESC`. |
| **UC-10: Autenticação de Operador** | RN-11, RN-12 | `POST /auth/login` | Login com JWT, rejeição de usuário inativo ou senha incorreta (401). |
| **UC-11: Atribuir Exceção de Permissão** | RN-10 | `POST /permissao/usuario/atribuir` | Concessão direta em PermissaoUser sobrepondo o cargo no PermissionGuard. |
| **UC-12: Listar Ativos Paginados** | RN-13 | `GET /utensilio/listar` | Consulta paginada via BaseQuery em Utensilio com eager loading de especializações. |

---

*Fim do Documento de Casos de Uso (v2.0.0).*  
*Status: Atualizado e Validado.*