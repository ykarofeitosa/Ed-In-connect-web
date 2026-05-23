# EdInConnect — Frontend

Interface web da plataforma EdInConnect, construída com React 19, TanStack Router e Tailwind CSS. A plataforma conecta estudantes, professores e responsáveis com dashboards dedicados para cada perfil.

## Tecnologias

- **[React 19](https://react.dev/)** — biblioteca de interface
- **[TanStack Router](https://tanstack.com/router)** — roteamento type-safe com suporte a file-based routing
- **[TanStack Query](https://tanstack.com/query)** — gerenciamento de estado assíncrono e cache de requisições
- **[TanStack Start](https://tanstack.com/start)** — framework fullstack para React com SSR
- **[Vite](https://vitejs.dev/)** — bundler e servidor de desenvolvimento
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilização utility-first
- **[Radix UI](https://www.radix-ui.com/)** — componentes acessíveis sem estilo
- **[Framer Motion](https://www.framer.com/motion/)** — animações declarativas
- **[Lucide React](https://lucide.dev/)** — ícones
- **[Zod](https://zod.dev/)** — validação de formulários
- **[React Hook Form](https://react-hook-form.com/)** — gerenciamento de formulários
- **[Sonner](https://sonner.emilkowal.ski/)** — notificações toast
- **[TypeScript](https://www.typescriptlang.org/)** — tipagem estática

## Pré-requisitos

- **[Node.js](https://nodejs.org/)** v18 ou superior
- **[Git](https://git-scm.com/)**
- API do EdInConnect rodando em `http://localhost:3333`

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/ykarofeitosa/Ed-In-connect.git
cd edinconnect-front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`.

> Certifique-se de que a API do backend está rodando antes de acessar qualquer rota autenticada.

## Estrutura de pastas

```
src/
├── components/
│   ├── ui/              # componentes da lib (Radix + Tailwind)
│   ├── DashboardLayout  # layout com sidebar para perfis autenticados
│   └── SiteNav          # navbar e footer do site público
├── hooks/
│   ├── use-auth         # contexto global de autenticação
│   ├── use-api          # hooks React Query para todos os endpoints
│   └── use-mobile       # detecção de viewport mobile
├── lib/
│   ├── api              # cliente HTTP base (fetch wrapper)
│   ├── auth             # helpers de sessão (localStorage)
│   └── utils            # utilitários de classes CSS
└── routes/
    ├── __root           # shell da aplicação e providers globais
    ├── index            # landing page pública
    ├── login            # autenticação
    ├── student          # dashboard do estudante
    ├── teacher          # dashboard do professor
    ├── family           # dashboard do responsável
    └── assistant        # chat com a assistente Edi
```

## Perfis da plataforma

| Perfil | Rota | Funcionalidades |
|---|---|---|
| Estudante | `/student` | Tarefas, progresso, frequência, modo inclusivo, notificações |
| Professor | `/teacher` | Turmas, alunos, criar tarefas, relatório pedagógico |
| Responsável | `/family` | Acompanhamento do filho, frequência, tarefas, notificações |

O login é unificado em `/login`. O redirecionamento para o dashboard correto acontece automaticamente com base no `role` retornado pela API após a autenticação.

## Autenticação

O token JWT retornado pela API é salvo no `localStorage` com a chave `@edinconnect:token`. O contexto `useAuth` disponibiliza `user`, `isAuthenticated`, `signIn` e `signOut` para toda a aplicação via React Context.

## Scripts disponíveis

```bash
npm run dev        # inicia o servidor de desenvolvimento
npm run build      # gera o build de produção
npm run preview    # serve o build localmente
npm run lint       # roda o ESLint
npm run format     # formata o código com Prettier
```# EdInConnect — Frontend

Interface web da plataforma EdInConnect, construída com React 19, TanStack Router e Tailwind CSS. A plataforma conecta estudantes, professores e responsáveis com dashboards dedicados para cada perfil.

## Tecnologias

- **[React 19](https://react.dev/)** — biblioteca de interface
- **[TanStack Router](https://tanstack.com/router)** — roteamento type-safe com suporte a file-based routing
- **[TanStack Query](https://tanstack.com/query)** — gerenciamento de estado assíncrono e cache de requisições
- **[TanStack Start](https://tanstack.com/start)** — framework fullstack para React com SSR
- **[Vite](https://vitejs.dev/)** — bundler e servidor de desenvolvimento
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilização utility-first
- **[Radix UI](https://www.radix-ui.com/)** — componentes acessíveis sem estilo
- **[Framer Motion](https://www.framer.com/motion/)** — animações declarativas
- **[Lucide React](https://lucide.dev/)** — ícones
- **[Zod](https://zod.dev/)** — validação de formulários
- **[React Hook Form](https://react-hook-form.com/)** — gerenciamento de formulários
- **[Sonner](https://sonner.emilkowal.ski/)** — notificações toast
- **[TypeScript](https://www.typescriptlang.org/)** — tipagem estática

## Pré-requisitos

- **[Node.js](https://nodejs.org/)** v18 ou superior
- **[Git](https://git-scm.com/)**
- API do EdInConnect rodando em `http://localhost:3333`

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/edinconnect-web.git
cd edinconnect-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`.

> Certifique-se de que a API do backend está rodando antes de acessar qualquer rota autenticada.

## Estrutura de pastas

```
src/
├── components/
│   ├── ui/              # componentes da lib (Radix + Tailwind)
│   ├── DashboardLayout  # layout com sidebar para perfis autenticados
│   └── SiteNav          # navbar e footer do site público
├── hooks/
│   ├── use-auth         # contexto global de autenticação
│   ├── use-api          # hooks React Query para todos os endpoints
│   └── use-mobile       # detecção de viewport mobile
├── lib/
│   ├── api              # cliente HTTP base (fetch wrapper)
│   ├── auth             # helpers de sessão (localStorage)
│   └── utils            # utilitários de classes CSS
└── routes/
    ├── __root           # shell da aplicação e providers globais
    ├── index            # landing page pública
    ├── login            # autenticação
    ├── student          # dashboard do estudante
    ├── teacher          # dashboard do professor
    ├── family           # dashboard do responsável
    └── assistant        # chat com a assistente Edi
```

## Perfis da plataforma

| Perfil | Rota | Funcionalidades |
|---|---|---|
| Estudante | `/student` | Tarefas, progresso, frequência, modo inclusivo, notificações |
| Professor | `/teacher` | Turmas, alunos, criar tarefas, relatório pedagógico |
| Responsável | `/family` | Acompanhamento do filho, frequência, tarefas, notificações |

O login é unificado em `/login`. O redirecionamento para o dashboard correto acontece automaticamente com base no `role` retornado pela API após a autenticação.

## Autenticação

O token JWT retornado pela API é salvo no `localStorage` com a chave `@edinconnect:token`. O contexto `useAuth` disponibiliza `user`, `isAuthenticated`, `signIn` e `signOut` para toda a aplicação via React Context.

## Scripts disponíveis

```bash
npm run dev        # inicia o servidor de desenvolvimento
npm run build      # gera o build de produção
npm run preview    # serve o build localmente
npm run lint       # roda o ESLint
npm run format     # formata o código com Prettier
```