# Zelos

## Sistema de Chamados - Escola SENAI Armando de Arruda Pereira

Este é um projeto de **sistema de chamados** para a **Escola SENAI Armando de Arruda Pereira**, desenvolvido para gerenciar solicitações de manutenção, apoio técnico e outros serviços para itens identificados pelo número de patrimônio da escola. O sistema foi construído com **Next.js**, **Node.js** e **MySQL**.

## Índice

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Como Iniciar](#como-iniciar)
4. [Estrutura de Diretórios](#estrutura-de-diretórios)
5. [Banco de Dados](#banco-de-dados)
6. [Desenvolvimento](#desenvolvimento)
7. [Integração AD](#integração-ad)
8. [Licença](#licença)

## Sobre o Projeto

Este sistema permite que os usuários registrem chamados de manutenção e outros serviços para itens da escola, utilizando o **número de patrimônio** como identificador dos itens. Ele permite que os técnicos acompanhem o progresso dos chamados, façam apontamentos sobre o status das manutenções e gerenciem o histórico de serviços realizados.

### Funcionalidades Principais:

- **Criação de Chamados**: Usuários podem criar chamados informando o número de patrimônio ou descrição de item e o tipo de serviço necessário.
- **Acompanhamento de Chamados**: Técnicos e usuários podem visualizar o status dos chamados e acompanhar as atualizações feitas pelos responsáveis.
- **Apontamentos de Técnicos**: Técnicos podem adicionar apontamentos detalhados sobre o serviço realizado.
- **Relatórios**: O sistema permite a geração de relatórios sobre os chamados, tipos de serviços e técnicos envolvidos.

## Tecnologias Utilizadas

- **Next.js**: Framework React para o frontend.
- **Node.js**: Ambiente de execução JavaScript para o backend.
- **Express.js**: Framework web para Node.js.
- **MySQL**: Banco de dados relacional para armazenamento de dados.

## Como Iniciar

### Pré-requisitos

Antes de começar, é necessário ter as seguintes ferramentas instaladas em sua máquina:

- **Node.js** (versão >= 14.x)
- **MySQL** (ou equivalente)

### 1. Clonar o repositório

```bash
git clone https://github.com/Paivs/Zelos.git
cd Zelos
```

### 2. Instalar dependências

Execute o comando abaixo para instalar as dependências do projeto:

```bash
cd frontend
npm install
cd ..
cd backend
npm install
cd ..
```

### 3. Configuração do Banco de Dados

Crie um banco de dados MySQL com o nome de sua escolha, por exemplo, `zelos`. Crie as credenciais de acesso e as teste.

### 4. Iniciar o servidor

Inicie o servidor de desenvolvimento do Next.js:

```bash
cd frontend
npm run dev
```

Agora, o sistema estará rodando em `http://localhost:3000`.

## Estrutura de Diretórios

A estrutura de diretórios do projeto segue a organização padrão do Next.js, com algumas adições para o backend:

```
/public              # Arquivos públicos estáticos
/app               # Páginas do frontend (Next.js)
  /usuario               # paginas do usuário comum
  /admin               # paginas do administrador
  /tecnico               # paginas do tecnico
/components          # Componentes reutilizáveis da UI
/utils               # Funções utilitárias
```

## Banco de Dados

O banco de dados utiliza o **MySQL** com a seguinte estrutura:

- **`usuarios`**: Tabela de usuários, contendo informações como nome, email, senha, função e status.
- **`pool`**: Pool de chamados (ex.: manutenção, apoio técnico, etc.).
- **`pool_tecnico`**: Relacionamento entre técnicos e tipos de serviços.
- **`chamados`**: Tabela de chamados, associando os chamados aos usuários e técnicos.
- **`apontamentos`**: Registra os apontamentos dos técnicos, incluindo horários de início e fim dos serviços.

## Desenvolvimento

Este projeto segue boas práticas de desenvolvimento utilizando o framework **Next.js** para o frontend e **Node.js/Express** para o backend. O banco de dados MySQL é acessado utilizando o **MySQL2**, proporcionando uma maneira eficiente e segura de interagir com o banco.

## Integração AD

O backend já está integrado com o AD. Autenticação de usuário é feita via o seguinte endpoint "/auth/login" com o JSON:

```json
{
  "username": "",
  "password": ""
}
```

Este endpoint só funciona via rede cabeada ou wifi B07. Caso precise implementar funcionalidades no endpoint de autenticação, evite remover ou alterar o código existente. Caso o faça, teste e valide.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
