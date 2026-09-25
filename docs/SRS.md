# SRS — Software Requirements Specification
## Katrix Estoque · Sistema de Gestão de Ativos de TI

> **Versão:** 2.0.0  
> **Data:** 2026-08-26  
> **Status:** Especificação Técnica Atualizada (Arquitetura TPT com Utensilio & RBAC Híbrido)  
> **Autores:** Product Owner Sênior & Arquiteto de Software  
> **Stack Base:** NestJS (TypeScript strict) + Prisma ORM v7.8 + PostgreSQL 15 (Docker) + Nuxt 3  
> **Documentos de Referência:** [PRD](PRD.md) | [Modelo de Dados](Modelo_de_Dados.md) | [Use Cases](Use_Cases.md)

---

## Sumário

1. [Introdução](#1-introdução)
   - 1.1 [Finalidade](#11-finalidade)
   - 1.2 [Escopo do Produto](#12-escopo-do-produto)
   - 1.3 [Definições, Siglas e Abreviações](#13-definições-siglas-e-abreviações)
   - 1.4 [Referências Normativas e Documentais](#14-referências-normativas-e-documentais)
2. [Visão Geral do Sistema e Arquitetura](#2-visão-geral-do-sistema-e-arquitetura)
   - 2.1 [Perspectiva do Produto e Padrão Table-per-Type (TPT)](#21-perspectiva-do-produto-e-padrão-table-per-type-tpt)
   - 2.2 [Classes e Perfis de Usuários (Atores)](#22-classes-e-perfis-de-usuários-atores)
   - 2.3 [Ambiente Operacional e Stack Tecnológica](#23-ambiente-operacional-e-stack-tecnológica)
   - 2.4 [Restrições e Premissas de Engenharia](#24-restrições-e-premissas-de-engenharia)
3. [Requisitos Funcionais (RF)](#3-requisitos-funcionais-rf)
   - 3.1 [Módulo 1: Gestão de Responsáveis](#31-módulo-1-gestão-de-responsáveis)
   - 3.2 [Módulo 2: Gestão de Ativos e Utensílios Eletrônicos (TPT)](#32-módulo-2-gestão-de-ativos-e-utensílios-eletrônicos-tpt)
   - 3.3 [Módulo 3: Gestão de Chips Telefônicos (TPT)](#33-módulo-3-gestão-de-chips-telefônicos-tpt)
   - 3.4 [Módulo 4: Gestão de Periféricos (TPT)](#34-módulo-4-gestão-de-periféricos-tpt)
   - 3.5 [Módulo 5: Motor de Vínculos Unificado e Ciclo de Vida](#35-módulo-5-motor-de-vínculos-unificado-e-ciclo-de-vida)
   - 3.6 [Módulo 6: Histórico Imutável e Rastreabilidade](#36-módulo-6-histórico-imutável-e-rastreabilidade)
   - 3.7 [Módulo 7: Autenticação, Usuários e RBAC Híbrido](#37-módulo-7-autenticação-usuários-e-rbac-híbrido)
   - 3.8 [Módulo 8: Relatórios, Visão Gerencial e Dashboard](#38-módulo-8-relatórios-visão-gerencial-e-dashboard)
   - 3.9 [Módulo 9: Interface do Usuário (Frontend Nuxt 3)](#39-módulo-9-interface-do-usuário-frontend-nuxt-3)
4. [Requisitos Não Funcionais (RNF) com Metas Mensuráveis](#4-requisitos-não-funcionais-rnf-com-metas-mensuráveis)
   - 4.1 [Desempenho (Performance)](#41-desempenho-performance)
   - 4.2 [Segurança e Proteção de Dados (RBAC Híbrido & JWT)](#42-segurança-e-proteção-de-dados-rbac-híbrido--jwt)
   - 4.3 [Disponibilidade e Resiliência](#43-disponibilidade-e-resiliência)
   - 4.4 [Usabilidade e Experiência da Interface](#44-usabilidade-e-experiência-da-interface)
   - 4.5 [Auditabilidade e Imutabilidade Transacional ACID](#45-auditabilidade-e-imutabilidade-transacional-acid)
   - 4.6 [Conformidade Legal e Privacidade (LGPD)](#46-conformidade-legal-e-privacidade-lgpd)
   - 4.7 [Manutenibilidade, Qualidade de Código e Arquitetura](#47-manutenibilidade-qualidade-de-código-e-arquitetura)
5. [Matriz de Rastreabilidade (PRD ↔ RF ↔ Código)](#5-matriz-de-rastreabilidade-prd--rf--código)
6. [Padronização de Contratos de Erro da API](#6-padronização-de-contratos-de-erro-da-api)
7. [Máquina de Estados de Ativos de TI](#7-máquina-de-estados-de-ativos-de-ti)

---

## 1. Introdução

### 1.1 Finalidade

Este documento de **Especificação de Requisitos de Software (SRS)** formaliza todos os requisitos técnicos, funcionais e não funcionais do sistema **Katrix Estoque**, em alinhamento rigoroso com a arquitetura relacional baseada em **Table-per-Type (TPT)** com a entidade `Utensilio` e o modelo de autorização **RBAC Híbrido** nativo em banco (`PermissaoRole` e `PermissaoUser`).

### 1.2 Escopo do Produto

O **Katrix Estoque** atua como o sistema autoritativo corporativo para:
- Cadastro e rastreamento de equipamentos e acessórios (Notebooks, Celulares, Tablets, Chips GSM/LTE e Periféricos);
- Transferência atômica de posse e guarda via motor de vínculos (`Vinculo -> Utensilio`);
- Manutenção perpétua de histórico imutável (`HistoricoObjeto`) com conformidade estrita para auditoria interna;
- Controle de acesso baseado em papéis com capacidade de concessão de exceções granulares por usuário.

### 1.3 Definições, Siglas e Abreviações

| Sigla / Termo | Definição Técnica |
|---|---|
| **TPT** | *Table-per-Type* — Padrão de mapeamento objeto-relacional onde uma entidade base (`Utensilio`) concentra atributos comuns e tabelas filhas (`Eletronico`, `Chip`, `Periferico`) armazenam atributos específicos compartilhando a mesma chave primária. |
| **RBAC Híbrido** | Modelo de controle de acesso que combina permissões por cargo (`PermissaoRole`) e exceções diretas por operador (`PermissaoUser`). |
| **ACID** | Atomicidade, Consistência, Isolamento e Durabilidade garantidas em transações `$transaction`. |
| **Utensilio** | Entidade base relacional que concentra status (`situacao`), localização (`cidade`), conservação (`condicao`) e categoria do item. |

---

## 2. Visão Geral do Sistema e Arquitetura

### 2.1 Perspectiva do Produto e Padrão Table-per-Type (TPT)

```
[ HTTP Client / Nuxt 3 Frontend ]
               │
               ▼
   [ NestJS Controller Layer ] ──> Global ValidationPipe (whitelist, transform)
               │
               ▼
    [ Use Case / Domain Layer ] ──> Regras de Negócio Puras & Validações de Estado
        │              │
        ▼              ▼
[ Query Repository ] [ Command Repository ]
   (BaseQuery<T>)       (Prisma $transaction ACID)
        │              │
        └──────┬───────┘
               ▼
      [ PostgreSQL 15 Engine ]
      ├── Utensilio (Base: situacao, cidade, condicao, categoria)
      │   ├── Eletronico (1:1 utensilioId, numeroSerie, marca, modelo, senha, seguro)
      │   ├── Chip (1:1 utensilioId, operadora, ddd, numero)
      │   └── Periferico (1:1 utensilioId, tipo, marca)
      ├── Vinculo (responsavelId, utensilioId, status)
      ├── HistoricoObjeto (vinculoId, responsavelId, acao, condicao, createAt)
      └── RBAC: Role, Permissao, PermissaoRole, PermissaoUser, Usuario
```

### 2.2 Classes e Perfis de Usuários (Atores)

- **Administrador (`ADMIN`):** Controle irrestrito, gestão de usuários, concessão de permissões pontuais via `PermissaoUser`.
- **Gestor de TI (`GESTOR`):** Acesso analítico global, auditoria de históricos e inventário multi-cidades.
- **Analista de TI (`ANALISTA`):** Operação diária de cadastros de hardware, vinculação e devolução de ativos.
- **Leitor / Auditor (`VIEWER`):** Visualização restrita para conferência física de prateleira.

### 2.3 Ambiente Operacional e Stack Tecnológica

- **Runtime Back-end:** Node.js v20+ LTS / NestJS v11 (TypeScript strict mode).
- **Persistência / ORM:** Prisma ORM v7.8 / PostgreSQL 15 em container Docker (`estoque_db`, porta 5431:5432).
- **Segurança:** Passport JWT + Bcrypt + PermissionGuard nativo.
- **Front-end:** Nuxt.js 3 / Vue 3 / TypeScript.
---

## 3. Requisitos Funcionais (RF)

### 3.1 Módulo 1: Gestão de Responsáveis

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-01** | Cadastrar Responsável | Criar novo colaborador responsável no sistema com validação de unicidade de e-mail corporativo. | `CreateResponsavelDto`: `nome`, `email` (único), `setor`, `cidade`, `status: true`. | Retorna `Responsavel` criado com UUIDv4 gerado. HTTP 201 Created. Erro 409 em e-mail duplicado. | Fase 1 - MVP |
| **RF-02** | Listar Responsáveis Paginado | Recuperar coleção paginada de responsáveis com metadados de paginação. | `ListarResponsaveisDto`: `paginas`, `limite`. | Objeto `{ dados: Responsavel[], meta: { totalRegistros, paginaAtual, limitePorPagina, totalPaginas } }`. HTTP 200 OK. | Fase 1 - MVP |
| **RF-03** | Consultar Responsável por E-mail | Buscar dados detalhados de um colaborador pelo seu e-mail corporativo. | Parâmetro `:email` (string). | Objeto `Responsavel` com vínculos e histórico associados. HTTP 200 OK ou 404. | Fase 1 - MVP |
| **RF-04** | Atualizar Dados do Responsável | Atualizar atributos cadastrais de um responsável existente com verificação de colisão de e-mail. | Parâmetro `:id` (UUID), `UpdateResponsavelDto`. | Registro atualizado. Erro 400 se e-mail idêntico ao atual; erro 409 se pertencer a outro responsável. HTTP 200 OK. | Fase 1 - MVP |
| **RF-05** | Desativação Lógica de Responsável | Inativar o responsável alterando `status` para `false` (Soft Delete), preservando vínculos históricos. | Parâmetro `:id` (UUID). | Atualização de `Responsavel.status = false`. Sem remoção física. HTTP 200 OK. | Fase 1 - MVP |
| **RF-06** | Bloqueio de Vínculo para Responsável Inativo | Impedir via Use Case que qualquer responsável com `status == false` receba custódia de novos ativos. | Checagem de integridade em `CriarVinculoUseCase`. | Lança `ConflictException` ('O responsável não está ativo') se `status == false`. | Fase 1 - MVP |

---

### 3.2 Módulo 2: Gestão de Ativos e Utensílios Eletrônicos (TPT)

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-07** | Cadastrar Eletrônico (TPT) | Inserir novo hardware persistindo a entidade base `Utensilio` (`categoria: ELETRONICO`, `cidade`, `situacao: LIVRE`, `condicao`) e a extensão 1:1 `Eletronico` (`numeroSerie` único, `tipo`, `marca`, `modelo`, `senha`, `seguro`). | `CriarEletronicoDto`: dados do dispositivo. | Registros inseridos atomicamente em `Utensilio` e `Eletronico`. HTTP 201 Created. Erro 409 se `numeroSerie` duplicado. | Fase 1 - MVP |
| **RF-08** | Listar Eletrônicos Paginados | Listar dispositivos eletrônicos de forma paginada unindo dados de `Utensilio` e `Eletronico` via eager loading de vínculo ativo. | `listarEletronicosDto`: `paginas`, `limite`. | Lista de eletrônicos contendo dados patrimoniais e vínculo ativo com responsável. HTTP 200 OK. | Fase 1 - MVP |
| **RF-09** | Consultar Eletrônico por ID | Recuperar dados completos de um eletrônico específico pelo identificador do utensílio (`utensilioId`). | Parâmetro `:id` (UUID). | Dados de `Utensilio` + `Eletronico` + histórico de vínculos passados. HTTP 200 OK ou 404. | Fase 1 - MVP |
| **RF-10** | Atualizar Dados de Eletrônico | Alterar dados cadastrais do eletrônico e/ou estado de conservação no `Utensilio`. | Parâmetro `:id` (UUID), `UpdateEletronicoDto`. | Registros atualizados no banco. HTTP 200 OK. | Fase 1 - MVP |
| **RF-11** | Filtrar Eletrônicos por Cidade e Condição | Filtragem dinâmica na listagem por cidade, condição física e disponibilidade (`situacao`). | Query params: `cidade`, `condicao`, `situacao`, `tipo`. | Array filtrado com metadados de paginação. HTTP 200 OK. | Fase 2 |

---

### 3.3 Módulo 3: Gestão de Chips Telefônicos (TPT)

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-12** | Cadastrar Chip (TPT) | Inserir linha celular criando `Utensilio` (`categoria: CHIP`, `cidade`, `situacao: LIVRE`, `condicao`) e extensão `Chip` (`operadora`, `ddd`, `numero` único). | `CreateChipDto`: dados do chip. | Registros criados em `Utensilio` e `Chip`. HTTP 201 Created. Erro 409 em número duplicado. | Fase 1 - MVP |
| **RF-13** | Listar Chips Paginados | Recuperar catálogo paginado de linhas celulares unindo dados de `Utensilio` e `Chip`. | `ListarChipsDto`: paginação e filtros opcionais. | Coleção paginada de chips com dados de vínculo. HTTP 200 OK. | Fase 1 - MVP |
| **RF-14** | Consultar Chip por ID ou Número | Buscar dados específicos de uma linha telefônica pelo seu ID ou número com DDD. | Parâmetro `:id` (UUID) ou query `numero`. | Objeto completo do chip com histórico de vínculos. HTTP 200 OK ou 404. | Fase 1 - MVP |
| **RF-15** | Atualizar Dados Cadastrais do Chip | Alterar operadora ou localidade do chip. | Parâmetro `:id` (UUID), `UpdateChipDto`. | Entidade `Chip` / `Utensilio` atualizada. HTTP 200 OK. | Fase 1 - MVP |

---

### 3.4 Módulo 4: Gestão de Periféricos (TPT)

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-16** | Cadastrar Periférico (TPT) | Inserir acessório criando `Utensilio` (`categoria: PERIFERICO`, `cidade`, `situacao: LIVRE`, `condicao`) e extensão `Periferico` (`tipo`, `marca`). | `CreatePerifericoDto`: dados do periférico. | Registros criados em `Utensilio` e `Periferico`. HTTP 201 Created. | Fase 1 - MVP |
| **RF-17** | Listar Periféricos Paginados | Consultar periféricos em estoque de forma paginada. | `ListarPerifericosDto`: paginação e filtros. | Coleção paginada de periféricos com metadados. HTTP 200 OK. | Fase 1 - MVP |
| **RF-18** | Consultar Periférico por ID | Recuperar detalhes técnicos e status de alocação de um periférico específico. | Parâmetro `:id` (UUID). | Registro do periférico com responsável vinculado se houver. HTTP 200 OK ou 404. | Fase 1 - MVP |
| **RF-19** | Atualizar Condição do Periférico | Atualizar estado de conservação (`Utensilio.condicao`) ou marca do periférico. | Parâmetro `:id` (UUID), `UpdatePerifericoDto`. | Registro atualizado no banco. HTTP 200 OK. | Fase 1 - MVP |

---

### 3.5 Módulo 5: Motor de Vínculos Unificado e Ciclo de Vida

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-20** | Validações Pré-Vinculação | Executar validações de integridade antes da transação: (1) `Utensilio` existe, (2) `Utensilio.situacao == LIVRE`, (3) `Responsavel` existe e `status == true`. | `CreateVinculoDto`: `responsavelId`, `utensilioId`, `detalhes`, `historico`. | Lança 404 se não encontrado; lança 409 se ativo ocupado ou responsável inativo. | Fase 1 - MVP |
| **RF-21** | Criação Atômica de Vínculo (Entrega) | Executar em bloco `$transaction`: (1) INSERT em `Vinculo` (`status: true`, `responsavelId`, `utensilioId`), (2) INSERT em `HistoricoObjeto` (`acao: ENTREGUE`), (3) UPDATE em `Utensilio` (`situacao: OCUPADO`). | DTO validado via `CriarVinculoUseCase`. | Registros persistidos atomicamente no PostgreSQL. HTTP 201 Created. | Fase 1 - MVP |
| **RF-22** | Registro Atômico de Devolução | Encerrar custódia em `$transaction`: (1) UPDATE `Vinculo.status = false`, (2) INSERT `HistoricoObjeto` (`acao: DEVOLVIDO`), (3) UPDATE `Utensilio.situacao = LIVRE`. | `DevolverAtivoDto`: `vinculoId`, `condicao`, `detalhes`. | Retorna confirmação de encerramento do vínculo. HTTP 200 OK. | Fase 1 - MVP |
| **RF-23** | Consultar Vínculo por ID | Recuperar dados completos de um vínculo específico, incluindo dados aninhados do responsável e do utensílio. | Parâmetro `:id` (UUID). | Objeto `Vinculo` completo com relações. HTTP 200 OK ou 404. | Fase 1 - MVP |
| **RF-24** | Listar Vínculos Ativos e Históricos | Listagem paginada de vínculos com filtro por status (`ativo/inativo`), responsável ou cidade. | `ListarVinculosDto`: parâmetros de paginação e filtro. | Coleção paginada de vínculos com metadados. HTTP 200 OK. | Fase 1 - MVP |
| **RF-25** | Bloqueio de Desvinculação Órfã | Impedir exclusão física de registros da tabela `Vinculo`. | Ausência de endpoint `DELETE /vinculo`. | Encerramentos ocorrem unicamente via Use Case de Devolução (RF-22). | Fase 1 - MVP |

---

### 3.6 Módulo 6: Histórico Imutável e Rastreabilidade

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-26** | Gravação Automática de Histórico | Gerar linha imutável em `HistoricoObjeto` a cada entrega (`ENTREGUE`) ou devolução (`DEVOLVIDO`) com carimbo temporal nativo do banco. | Chamada automática via Command Repository dentro do `$transaction`. | Linha criada contendo `vinculoId`, `responsavelId`, `condicao`, `acao`, `detalhes`, `createAt`. | Fase 1 - MVP |
| **RF-27** | Imutabilidade Estrutural de Histórico | Bloquear integralmente qualquer operação de modificação (`UPDATE`) ou remoção (`DELETE`) sobre a tabela `HistoricoObjeto`. | Ausência de endpoints e métodos de mutação na camada de persistência. | Nenhuma rota expõe alteração de histórico. | Fase 1 - MVP |
| **RF-28** | Consultar Linha do Tempo por Utensílio | Recuperar ordenadamente (cronológica decrescente) todos os eventos de histórico vinculados a um item patrimonial. | Parâmetro `:utensilioId` (UUID). | Array ordenado de `HistoricoObjeto` com dados de responsáveis e condições físicas. HTTP 200 OK. | Fase 1 - MVP |
| **RF-29** | Consultar Histórico por Responsável | Listar todas as movimentações históricas associadas a um colaborador específico. | Parâmetro `:responsavelId` (UUID). | Coleção de movimentações vinculadas ao responsável. HTTP 200 OK. | Fase 2 |

---

### 3.7 Módulo 7: Autenticação, Usuários e RBAC Híbrido

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-30** | Cadastro de Usuário Operador | Registrar usuário interno com senha criptografada via `bcrypt` (salt >= 10), `ativo: true` e associação a um `Role` base com `onDelete: Restrict`. | `CreateUsuarioDto`: `nome`, `email` (único), `senha`, `roleId`, `avatarUrl`, `responsavelId`. | Entidade `Usuario` criada (senha omitida). HTTP 201 Created. Erro 409 em e-mail duplicado. | Fase 1 - MVP |
| **RF-31** | Autenticação via Credenciais (Login) | Validar e-mail e senha, checar `Usuario.ativo == true` e emitir JWT contendo `sub`, `email` e `roleId`. | `LoginDto`: `email`, `senha`. | Objeto `{ accessToken, tokenType: 'Bearer', expiresIn, user }`. HTTP 200 OK. Erro 401 se credenciais inválidas ou usuário inativo. | Fase 1 - MVP |
| **RF-32** | Guard Global de Autenticação JWT | Interceptar requisições validando assinatura do Bearer Token no header `Authorization`. | Header `Authorization: Bearer <token>`. | Injeta `req.user` autenticado no contexto. Lança 401 se inválido. | Fase 1 - MVP |
| **RF-33** | Guard de Permissão RBAC Híbrido | Validar permissão requerida inspecionando: (1) `PermissaoUser` (exceção prioritária); (2) `PermissaoRole` (permissões do cargo). | Metadata `@RequirePermissions(key)` e `req.user`. | Libera acesso ou lança 403 Forbidden. | Fase 1 - MVP |
| **RF-34** | Concessão de Exceção Granular (`PermissaoUser`) | Permitir ao Administrador conceder ou revogar uma chave de permissão diretamente na tabela `PermissaoUser`. | `AtribuirPermissaoUserDto`: `userId`, `permissaoId`. | Registro persistido/removido em `PermissaoUser`. HTTP 200 OK. | Fase 1 - MVP |
| **RF-35** | Gestão de Roles e Permissões Base | CRUD completo de Roles (`Role.nome` único) e associação de chaves padrão em `PermissaoRole`. | DTOs de gestão de Roles e Permissões. | Configuração das matrizes de acesso. HTTP 200/201. | Fase 1 - MVP |
| **RF-36** | Renovação de Token (Refresh Token) | Permitir renovação do accessToken utilizando refreshToken seguro. | `RefreshTokenDto` / Cookie seguro. | Novo par de tokens sem necessidade de relogin. HTTP 200 OK. | Fase 2 |
| **RF-37** | Bloqueio Imediato de Operador (`Usuario.ativo`) | Suspender acesso do usuário definindo `ativo = false`, bloqueando logins e requisições imediatamente. | Parâmetro `:id` (UUID), `ativo: false`. | Usuário inativado; JWT Guard rejeita acessos. HTTP 200 OK. | Fase 1 - MVP |

---

### 3.8 Módulo 8: Relatórios, Visão Gerencial e Dashboard

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-38** | Dashboard de Totalizadores de Inventário | Exibir contagem agregada de utensílios por categoria, situação (`LIVRE` vs `OCUPADO`) e filial. | Requisição `GET /dashboard/metricas`. | Objeto consolidado com KPIs quantitativos por cidade e categoria. HTTP 200 OK. | Fase 2 |
| **RF-39** | Relatório de Ativos por Responsável | Visualização de todos os utensílios sob custódia de um determinado colaborador ou setor. | Query params: `responsavelId`, `setor`, `cidade`. | Lista de itens sob custódia com metadados. HTTP 200 OK. | Fase 2 |
| **RF-40** | Relatório de Termo de Entrega (PDF) | Gerar documento formatado de Termo de Responsabilidade para assinatura. | Parâmetro `:vinculoId` (UUID). | Payload estruturado para renderização e exportação em PDF. HTTP 200 OK. | Fase 2 |
| **RF-41** | Exportação de Inventário em Planilha | Exportar dados de inventário com filtros aplicados para relatórios contábeis. | Filtros + formato (`csv`, `xlsx`). | Stream binário do arquivo para download. HTTP 200 OK. | Fase 2 |
| **RF-42** | Alerta de Ativos sem Movimentação | Notificar gestores sobre itens com vínculo ativo prolongado. | Job agendado / Endpoint. | Lista de alertas gerenciais. HTTP 200 OK. | Fase 3 |

---

### 3.9 Módulo 9: Interface do Usuário (Frontend Nuxt 3)

| ID | Nome do Requisito | Descrição Técnica Detalhada | Entradas / Validações | Saídas / Efeitos Colaterais | Prioridade / Fase |
|---|---|---|---|---|---|
| **RF-43** | Tela de Autenticação e Sessão | Formulário de login com persistência de token via Pinia Store. | Formulário: e-mail e senha. | Armazenamento de token e redirecionamento para o Dashboard. | Fase 1 - MVP |
| **RF-44** | Telas de Listagem com Paginação | Tabelas reativas com controle de página, limite e filtros dinâmicos via SPA. | Interações de clique e digitação em busca. | Atualização assíncrona da grid sem recarregar a página. | Fase 2 |
| **RF-45** | Modal de Criação de Vínculo | Interface guiada para selecionar responsável ativo e utensílio livre. | Dropdowns assíncronos e formulário. | Disparo de `POST /vinculo/create` com feedback imediato. | Fase 2 |
| **RF-46** | Linha do Tempo Visual (Timeline) | Componente gráfico exibindo o histórico de movimentações do item. | Consulta por ID do utensílio. | Renderização de eventos históricos com status e datas. | Fase 2 |
| **RF-47** | Guards de Rota no Frontend | Middleware de roteamento que bloqueia navegação em páginas restritas conforme permissões do usuário. | Rota destino e permissões na Pinia Store. | Redirecionamento para `/unauthorized` ou `/login` se acesso negado. | Fase 2 |
---

## 4. Requisitos Não Funcionais (RNF) com Metas Mensuráveis

### 4.1 Desempenho (Performance)

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-PERF-01** | Tempo de Resposta da API REST | Latência de resposta para endpoints de leitura e escrita. | **p95 < 200ms** para requisições de listagem paginada; **p99 < 500ms** para transações `$transaction`. |
| **RNF-PERF-02** | Otimização de Queries e Índices | Toda tabela relacional que participa de filtros, cláusulas `WHERE`, `JOIN` ou ordenações deve possuir índice explícito no PostgreSQL. | Índices ativos: `Usuario.email` (UNIQUE), `Usuario.roleId`, `Role.nome` (UNIQUE), `Permissao.key` (UNIQUE + INDEX), `PermissaoRole.permissaoId`, `PermissaoUser.permissaoId`, `Responsavel.email` (UNIQUE), `Eletronico.numeroSerie` (UNIQUE), `Chip.numero` (UNIQUE), `Vinculo.responsavelId`, `Vinculo.utensilioId`, `HistoricoObjeto.responsavelId`. |
| **RNF-PERF-03** | Paginação Obrigatória e Limite de Payload | Nenhuma rota de listagem pode retornar coleções irrestritas. | Todas as rotas `GET /listar` estendem `BaseQuery<T>` com limite default de **10 a 50 registros por página** e teto rígido de **100 registros**. |
| **RNF-PERF-04** | Consumo de Memória do Processo Node.js | O servidor NestJS deve manter perfil leve de alocação de memória heap. | Consumo de memória heap **< 150 MB** em repouso e **< 300 MB** sob pico de carga operacional. |
| **RNF-PERF-05** | Pooling de Conexões com PostgreSQL | O Prisma ORM gerencia pool de conexões otimizado com o container PostgreSQL. | Pool configurado para até **20 conexões simultâneas** sem timeout de conexão. |

---

### 4.2 Segurança e Proteção de Dados (RBAC Híbrido & JWT)

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-SEC-01** | Criptografia de Senhas de Usuários | Todas as senhas de operadores (`Usuario.senha`) devem ser armazenadas com hashing criptográfico. | Utilização de **bcrypt com salt rounds >= 10**. Proibido texto plano. |
| **RNF-SEC-02** | Validação Estrita de Input | Bloqueio global de propriedades não declaradas em DTOs. | `ValidationPipe` global ativado com `whitelist: true`, `forbidNonWhitelisted: true` e `transform: true`. |
| **RNF-SEC-03** | Autenticação Stateless via JWT | Tokens de acesso com assinatura HMAC-SHA256 e tempo de expiração estrito. | Expiração do `accessToken` em **máximo 60 minutos**; `JWT_SECRET` com no mínimo **256 bits**. |
| **RNF-SEC-04** | Resolução do RBAC Híbrido em Camada Única | O `PermissionGuard` valida autorizações inspecionando primeiro `PermissaoUser` (exceção) e depois `PermissaoRole` (cargo). | Tempo de resolução do Guard **< 15ms**; **100% dos endpoints protegidos** cobertos por testes unitários. |
| **RNF-SEC-05** | Sanitização de Resposta e Omissão de Senhas | Nenhum endpoint pode vazar hashes de senhas de usuários em payloads JSON. | Utilização de `@Exclude()` no campo `senha` ou seleção explícita no Prisma. **0 vazamentos de hash**. |
| **RNF-SEC-06** | Prevenção contra SQL Injection | Todas as interações com o PostgreSQL devem ser parametrizadas via Prisma Client. | **0 queries concatenadas manualmente via string pura**. |
| **RNF-SEC-07** | Tratamento Seguro de Senhas de Dispositivos | O campo opcional `Eletronico.senha` tem acesso restrito a operadores com permissão explícita `eletronico:read_credentials`. | Usuários sem essa permissão recebem o campo mascarado ou nulo. |

---

### 4.3 Disponibilidade e Resiliência

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-DISP-01** | Resiliência do Banco de Dados via Docker | O container PostgreSQL (`estoque_db`) deve reiniciar automaticamente em caso de falha. | Configuração `restart: always` no `docker-compose.yml`. Recuperação em **< 10 segundos**. |
| **RNF-DISP-02** | Persistência Durável de Dados (Zero Data Loss) | Dados relacionais persistidos em volume nomeado isolado. | Volume `postgres_data` montado em `/var/lib/postgresql/data`. **0 perda de dados** em restarts. |
| **RNF-DISP-03** | Healthcheck e Diagnóstico | Endpoint de checagem de saúde da API e do banco. | Endpoint `GET /health` respondendo HTTP 200 OK em **< 50ms**. |
| **RNF-DISP-04** | Graceful Shutdown | O servidor NestJS encerra conexões com o banco de forma segura. | `app.enableShutdownHooks()` ativado no `main.ts`. |
| **RNF-DISP-05** | Isolamento com onDelete: Restrict | Proteção estrutural contra deleção acidental de dados mestres. | Regras `onDelete: Restrict` ativas em `Usuario -> Role`, `PermissaoRole`, `PermissaoUser` e `Vinculo`. |

---

### 4.4 Usabilidade e Experiência da Interface

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-USA-01** | Padronização de Códigos de Status HTTP | Endpoints seguem rigorosamente convenção RESTful. | `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`. |
| **RNF-USA-02** | Mensagens de Erro Claras em pt-BR | Exceções de negócio com mensagens descritivas em português. | **100% das exceções nos Use Cases** com mensagens humanizadas inteligíveis. |
| **RNF-USA-03** | Eficiência no Fluxo de Vinculação | Criação de vínculo em fluxo operacional enxuto. | Concluído em **no máximo 4 etapas / 3 cliques** no Nuxt 3. |
| **RNF-USA-04** | Responsividade e Acessibilidade | Interface funcional em desktops e tablets. | Resoluções de **1024x768 até 1920x1080**, com contraste **WCAG 2.1 AA**. |
| **RNF-USA-05** | Feedback Visual Assíncrono | Indicadores imediatos de carregamento e toasts. | Indicador visível em **< 100ms**; toasts com auto-dismiss em 4s. |

---

### 4.5 Auditabilidade e Imutabilidade Transacional ACID

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-AUD-01** | Atomicidade de Transações de Vínculo | Vinculação e devolução isoladas em transação de banco. | Execução via `prisma.$transaction()`. **0 itens ocupados sem vínculo registrado**. |
| **RNF-AUD-02** | Imutabilidade Estrutural de HistoricoObjeto | Sem coluna `updateAt` e sem métodos de mutação na API. | Ausência de `@updatedAt` no schema. **0 rotas de update/delete**. |
| **RNF-AUD-03** | Timestamp Confiável do Servidor | Movimentações registradas com relógio seguro do PostgreSQL. | `createAt DateTime @default(now())` gravado em UTC. |
| **RNF-AUD-04** | Rastreabilidade de Autoria e Posse | Eventos identificam o responsável (`responsavelId`) e vínculo (`vinculoId`). | Integridade referencial obrigatória em `HistoricoObjeto`. |
| **RNF-AUD-05** | Logs Estruturados em JSON | Emissão de logs estruturados para mutações de inventário. | Logs contendo timestamp, nível, rota e IDs de recursos afetados. |
| **RNF-AUD-06** | Compensação Append-Only | Correções efetuadas via novo lançamento, jamais alterando o passado. | Modelo append-only estrito nos Use Cases. |

---

### 4.6 Conformidade Legal e Privacidade (LGPD)

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-LGPD-01** | Minimização de Dados Pessoais | Coleta estritamente limitada a Nome, E-mail corporativo, Setor, Cidade e Assinatura. | **Proibida coleta de dados sensíveis**. |
| **RNF-LGPD-02** | Base Legal Amparada (Art. 7º, V e IX) | Finalidade vinculada à execução de contrato e proteção patrimonial. | Finalidade documentada formalmente. |
| **RNF-LGPD-03** | Direito de Acesso e Transparência | Capacidade de exportar extrato completo de dados do titular. | Consultas por e-mail e histórico respondendo em **< 2 segundos**. |
| **RNF-LGPD-04** | Retenção Justificada e Soft Delete | Inativação via `status = false` sem exclusão física do histórico. | **0 deleções em cascata** sobre históricos de custódia. |
| **RNF-LGPD-05** | Sigilo do Arquivo de Assinatura | Acesso ao termo de assinatura restrito a perfis `ADMIN` e `GESTOR`. | Proteção de leitura aplicada nos Guards. |

---

### 4.7 Manutenibilidade, Qualidade de Código e Arquitetura

| ID | Requisito Não Funcional | Descrição Técnica e Arquitetural | Meta Mensurável / Critério de Aceite |
|---|---|---|---|
| **RNF-MAN-01** | Aderência à Clean Architecture, TPT e CQRS | Separação física e lógica entre Controllers, Use Cases, DTOs, Query e Command Repositories. | **0 chamadas diretas de banco em Controllers**. |
| **RNF-MAN-02** | Tipagem Estrita em TypeScript | Strict mode ativo no `tsconfig.json`. | `"strict": true`, `"noImplicitAny": true`. Zero `any` em regras de negócio. |
| **RNF-MAN-03** | Reutilização de Infraestrutura via `BaseQuery<T>` | Query Repositories herdam de `BaseQuery<T>` para paginação uniforme. | **100% dos repositórios de consulta** estendendo `BaseQuery<T>`. |
| **RNF-MAN-04** | Cobertura de Testes Automatizados | Use Cases críticos com suíte de testes unitários e de integração. | Cobertura **>= 80% nos Use Cases** e **>= 70% nos Commands**. |
| **RNF-MAN-05** | Padronização com ESLint e Prettier | Código em conformidade com linter e formatador. | `npm run lint` com **0 erros e 0 warnings**. |
| **RNF-MAN-06** | Git Flow e Conventional Commits | Versionamento estruturado em feature branches e commits semânticos. | Padrão `feat:`, `fix:`, `refactor:`, `docs:`. |
| **RNF-MAN-07** | Modularidade no NestJS | Domínios encapsulados em seus respectivos `@Module`. | **0 dependências circulares**. |

---

## 5. Matriz de Rastreabilidade (PRD ↔ RF ↔ Código)

| Épico PRD | Funcionalidade PRD | ID SRS | Use Case / Arquivo Backend | Status no Código / Banco |
|---|---|---|---|---|
| **Épico 1: Gestão de Responsáveis** | F-01 (Criar responsável) | **RF-01** | `CriarResponsavelUseCase` (`criar-responsavel.use-case.ts`) | ✅ Implementado |
| | F-02 (Listar responsáveis) | **RF-02** | `ListarTodosResponsaveis` (`listar-todos-responsaveis.use-case.ts`) | ✅ Implementado |
| | F-03 (Buscar por e-mail) | **RF-03** | `MostrarUmResponsavel` (`mostrar-um-responsavel.use-case.ts`) | ✅ Implementado |
| | F-04 (Atualizar responsável)| **RF-04** | `AtualizarResponsavel` (`atualizar-responsavel.use-case.ts`) | ✅ Implementado |
| | F-05 (Deletar responsável) | **RF-05** | `DeletarResponsavel` (`deletar-responsavel.use-case.ts`) | ✅ Implementado |
| | F-06 (Bloqueio inativo) | **RF-06** | `CriarVinculoUseCase` (`criar-vinculo.use-case.ts`) | ✅ Implementado |
| **Épico 2: Gestão de Eletrônicos (TPT)**| F-07 (Cadastrar eletrônico)| **RF-07** | `CriarEletronicoUseCase` (`Utensilio` + `Eletronico`) | ⏳ Adaptar p/ TPT |
| | F-08 (Listar eletrônicos) | **RF-08** | `ListarEletronicosUseCase` | ⏳ Adaptar p/ TPT |
| | F-09 (Buscar por ID) | **RF-09** | `EletronicoQuery.listarUmEletronico` | ⏳ Adaptar p/ TPT |
| | F-10 (Atualizar eletrônico) | **RF-10** | `AtualizarEletronicoUseCase` | ⏳ A Desenvolver |
| | F-11 (Seguro do ativo) | **RF-11** | `CriarEletronicoDto` (`seguro: boolean`) | ✅ Implementado |
| **Épico 3: Gestão de Chips (TPT)** | F-12 (Cadastrar chip) | **RF-12** | `CriarChipUseCase` (`Utensilio` + `Chip`) | ⏳ A Desenvolver |
| | F-13 (Listar chips) | **RF-13** | `ListarChipsUseCase` | ⏳ A Desenvolver |
| | F-14 (Vincular chip) | **RF-14** | `VinculoCommand` (via `utensilioId`) | ✅ Schema Pronto |
| **Épico 4: Gestão de Periféricos (TPT)**| F-15 (Cadastrar periférico)| **RF-15** | `CriarPerifericoUseCase` (`Utensilio` + `Periferico`) | ⏳ A Desenvolver |
| | F-16 (Listar periféricos) | **RF-16** | `ListarPerifericosUseCase` | ⏳ A Desenvolver |
| | F-17 (Vincular periférico) | **RF-17** | `VinculoCommand` (via `utensilioId`) | ✅ Schema Pronto |
| **Épico 5: Vínculo e Ciclo de Vida**| F-18 (Criar vínculo TPT) | **RF-21** | `CriarVinculoUseCase` + `VinculoCommand` | ⏳ Adaptar p/ TPT |
| | F-19 (Validações de negócio)| **RF-20** | `CriarVinculoUseCase.execute()` | ⏳ Adaptar p/ TPT |
| | F-20 (Gravar HistoricoObjeto)| **RF-26** | `VinculoCommand.createVinculo` | ✅ Implementado |
| | F-21 (Atualizar situacao) | **RF-21** | `VinculoCommand.createVinculo` (`Utensilio.update`) | ⏳ Adaptar p/ TPT |
| | F-22 (Devolução de ativo) | **RF-22** | `DevolverAtivoUseCase` (`devolver-ativo.use-case.ts`) | ⏳ A Desenvolver |
| | F-23 (Listar histórico) | **RF-28** | `HistoricoQuery.listarPorUtensilio` | ⏳ A Desenvolver |
| **Épico 6: Autenticação e RBAC** | F-24 (Cadastro de usuário) | **RF-30** | `CriarUsuarioUseCase` (com `Usuario.ativo`) | ⏳ A Desenvolver |
| | F-25 (Login e JWT) | **RF-31** | `LoginUseCase` | ⏳ A Desenvolver |
| | F-26 (Guard JWT) | **RF-32** | `JwtAuthGuard` | ⏳ A Desenvolver |
| | F-27 (Guard RBAC Híbrido) | **RF-33** | `PermissionGuard` (`PermissaoUser` > `PermissaoRole`) | ⏳ A Desenvolver |
| | F-28 / F-29 (Atribuição Perm) | **RF-34, RF-35** | `PermissaoService` (`PermissaoUser` & `PermissaoRole`) | ⏳ A Desenvolver |

---

## 6. Padronização de Contratos de Erro da API

Todos os erros retornados pela API seguem a estrutura JSON padronizada (RFC 7807):

```json
{
  "statusCode": 409,
  "timestamp": "2026-08-26T15:00:00.000Z",
  "path": "/vinculo/create",
  "error": "Conflict",
  "message": "O objeto não está livre no estoque"
}
```

---

## 7. Máquina de Estados de Ativos de TI

O ciclo de vida de qualquer item (`Utensilio`) obedece à seguinte máquina de estados finitos:

```
                  ┌────────────────────────────────────────┐
                  │               [ INÍCIO ]               │
                  └───────────────────┬────────────────────┘
                                      │
                                      │ Cadastro no Sistema (Utensilio + Especialização)
                                      ▼
                  ┌────────────────────────────────────────┐
                  │                 LIVRE                  │ ◄─────────────────────────┐
                  │        (Utensilio.situacao)            │                           │
                  └───────────────────┬────────────────────┘                           │
                                      │                                                │
                                      │ Criar Vínculo (RF-21)                          │ Devolver Ativo (RF-22)
                                      │ [$transaction:                                 │ [$transaction:
                                      │  - INSERT Vinculo (responsavelId, utensilioId) │  - UPDATE Vinculo (status=false)
                                      │  - INSERT Historico (ENTREGUE)                 │  - INSERT Historico (DEVOLVIDO)
                                      │  - UPDATE Utensilio situacao=OCUPADO]          │  - UPDATE Utensilio situacao=LIVRE]
                                      ▼                                                │
                  ┌────────────────────────────────────────┐                           │
                  │                OCUPADO                 │ ──────────────────────────┘
                  │          (Utensilio.situacao)          │
                  └───────────────────┬────────────────────┘
                                      │
                                      │ Descarte / Baixa Patrimonial (Fase 3)
                                      ▼
                  ┌────────────────────────────────────────┐
                  │                DESCARTE                │
                  │            [ ESTADO FINAL ]            │
                  └────────────────────────────────────────┘
```

---

*Fim da Especificação de Requisitos de Software (SRS v2.0.0).*  
*Status: Atualizado e Validado.*