<div align="center">

# 🎵 **Liturgia Isaías**
### Sistema de Repertório Litúrgico Digital

[![Next.js](https://img.shields.io/badge/Next.js-14.2.32-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Sistema completo para planejamento e organização de músicas litúrgicas católicas**

[🚀 **Demo Live**](https://liturgia-isaias.vercel.app) • [📖 **Documentação**](#-documentação) • [🐛 **Issues**](https://github.com/clenio77/liturgia-isaias/issues) • [💬 **Discussões**](https://github.com/clenio77/liturgia-isaias/discussions)

</div>

---

## 📋 **Índice**

- [✨ Funcionalidades](#-funcionalidades)
- [🚀 Tecnologias](#-tecnologias)
- [⚡ Quick Start](#-quick-start)
- [🔧 Instalação Completa](#-instalação-completa)
- [🌐 Deploy](#-deploy)
- [👥 Usuários Demo](#-usuários-demo)
- [📱 PWA](#-progressive-web-app)
- [🏗️ Arquitetura](#️-arquitetura)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## ✨ **Funcionalidades**

### 🎵 **Gestão de Músicas**
- 📚 **Biblioteca completa** de músicas litúrgicas
- 📄 **Upload de PDFs** e imagens com OCR
- 🏷️ **Sistema de tags** e categorização avançada
- 🎼 **Transposição automática** de cifras
- 🔍 **Filtros inteligentes** por tempo litúrgico e parte da missa
- ⭐ **Sistema de favoritos** e avaliações

### 📅 **Planejamento de Missas**
- 📆 **Calendário litúrgico** integrado e atualizado
- 🤖 **Sugestões automáticas** de músicas por celebração
- 📝 **Planejamento detalhado** por partes da missa
- 📊 **Histórico completo** de repertórios utilizados
- 🔄 **Reutilização** de repertórios anteriores

### 📺 **Modo Apresentação**
- 🖥️ **Interface otimizada** para projeção em telões
- ⌨️ **Controle por teclado** para navegação rápida
- 🔤 **Ajuste dinâmico** de fonte e visibilidade
- 🖼️ **Modo tela cheia** sem distrações
- 🎨 **Temas personalizáveis** para diferentes ambientes

### 👥 **Sistema Multiusuário**
- 👤 **Perfis diferenciados**: Administrador, Padre, Músico
- 🔐 **Controle granular** de permissões
- 🛡️ **Autenticação segura** com JWT
- ⚙️ **Área administrativa** completa
- 📊 **Relatórios** de uso e estatísticas

### 📱 **Progressive Web App (PWA)**
- 📲 **Instalável** em dispositivos móveis e desktop
- 🔄 **Funciona offline** com cache inteligente
- 🔔 **Notificações push** para lembretes
- 📱 **Interface responsiva** para todos os dispositivos
- ⚡ **Performance otimizada** com Service Workers

---

## 🚀 **Tecnologias**

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[React 18](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e consistentes

### **Backend & Database**
- **[Prisma ORM](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Redis](https://redis.io/)** - Cache em memória para performance

### **Autenticação & Segurança**
- **[NextAuth.js](https://next-auth.js.org/)** - Autenticação completa
- **JWT** - Tokens seguros para sessões
- **Bcrypt** - Hash seguro de senhas

### **PWA & Performance**
- **[next-pwa](https://github.com/shadowwalker/next-pwa)** - Service Workers
- **Workbox** - Estratégias de cache avançadas
- **Web App Manifest** - Instalação nativa

### **Deploy & DevOps**
- **[Vercel](https://vercel.com/)** - Hospedagem otimizada para Next.js
- **GitHub Actions** - CI/CD automatizado
- **Docker** - Containerização para desenvolvimento

---

## ⚡ **Quick Start**

```bash
# 1. Clone o repositório
git clone https://github.com/clenio77/liturgia-isaias.git
cd liturgia-isaias

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

🎉 **Pronto!** Acesse [http://localhost:3000](http://localhost:3000) e faça login com os usuários demo.

---

## 🔧 **Instalação Completa**

### **Pré-requisitos**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** ou **pnpm**
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** (opcional, para cache) ([Download](https://redis.io/download))

### **1. Configuração do Ambiente**

```bash
# Clone o repositório
git clone https://github.com/clenio77/liturgia-isaias.git
cd liturgia-isaias

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install
```

### **2. Configuração do Banco de Dados**

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
nano .env.local
```

**Exemplo de configuração (.env.local):**
```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/liturgia_isaias"

# NextAuth
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Redis (opcional)
REDIS_URL="redis://localhost:6379"

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASSWORD="sua-senha-de-app"
```

### **3. Configuração do Prisma**

```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Seed do banco (dados iniciais)
npm run db:seed
```

### **4. Executar em Desenvolvimento**

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Ou com debug
npm run dev:debug

# Verificar tipos TypeScript
npm run type-check

# Executar linter
npm run lint
```

---

## 🌐 **Deploy**

### **🚀 Deploy na Vercel (Recomendado)**

#### **Método 1: Dashboard Vercel**
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"New Project"**
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente
5. Clique em **"Deploy"**

#### **Método 2: Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### **Método 3: Script Automatizado**
```bash
# Usar script de deploy incluído
./deploy.sh
```

### **🐳 Deploy com Docker**

```bash
# Build da imagem
docker build -t liturgia-isaias .

# Executar container
docker run -p 3000:3000 liturgia-isaias
```

### **☁️ Outras Plataformas**

<details>
<summary><strong>Netlify</strong></summary>

```bash
# Build para produção
npm run build
npm run export

# Deploy na Netlify
npx netlify-cli deploy --prod --dir=out
```
</details>

<details>
<summary><strong>Railway</strong></summary>

```bash
# Conectar com Railway
npx @railway/cli login
npx @railway/cli link

# Deploy
npx @railway/cli up
```
</details>

---

## 👥 **Usuários Demo**

O sistema vem com usuários pré-configurados para demonstração:

| Perfil | Email | Senha | Permissões |
|--------|-------|-------|------------|
| 👑 **Admin Sistema** | `admin@liturgia.com` | `admin123` | Todas as permissões |
| ⛪ **Pe. João (Admin)** | `pe.joao@paroquia.com` | `padre123` | Gerenciar usuários, músicas, missas |
| 🎵 **Maria (Usuário)** | `maria@liturgia.com` | `maria123` | Gerenciar músicas e missas |

### **🔐 Criando Novos Usuários**

```bash
# Via interface administrativa
# 1. Faça login como admin
# 2. Acesse /admin/usuarios
# 3. Clique em "Novo Usuário"

# Via CLI (em desenvolvimento)
npm run user:create
```

---

## 📱 **Progressive Web App**

### **📲 Instalação**

#### **No Mobile (Android/iOS):**
1. Acesse o site no navegador
2. Toque no menu do navegador
3. Selecione **"Adicionar à tela inicial"**
4. Confirme a instalação

#### **No Desktop (Chrome/Edge):**
1. Acesse o site
2. Clique no ícone de instalação na barra de endereços
3. Clique em **"Instalar"**

### **✨ Funcionalidades PWA**

- 📱 **App nativo** - Funciona como aplicativo instalado
- 🔄 **Offline** - Cache inteligente para uso sem internet
- 🔔 **Notificações** - Lembretes de missas e eventos
- ⚡ **Performance** - Carregamento instantâneo
- 🎨 **Tema** - Integração com tema do sistema

### **🛠️ Configuração PWA**

O PWA é configurado automaticamente, mas você pode personalizar:

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})
```

---

## 🏗️ **Arquitetura**

### **📁 Estrutura do Projeto**

```
liturgia-isaias/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 (auth)/            # Rotas de autenticação
│   ├── 📁 admin/             # Área administrativa
│   ├── 📁 api/               # API Routes
│   └── 📄 layout.tsx         # Layout principal
├── 📁 components/            # Componentes React
│   ├── 📁 ui/               # Componentes base
│   ├── 📁 auth/             # Componentes de autenticação
│   └── 📁 layout/           # Componentes de layout
├── 📁 contexts/             # React Contexts
├── 📁 lib/                  # Utilitários e configurações
├── 📁 prisma/               # Schema e migrações do banco
├── 📁 public/               # Arquivos estáticos
└── 📁 types/                # Definições TypeScript
```

### **🔄 Fluxo de Dados**

```mermaid
graph TD
    A[Cliente] --> B[Next.js App Router]
    B --> C[Middleware de Auth]
    C --> D[API Routes]
    D --> E[Prisma ORM]
    E --> F[PostgreSQL]
    D --> G[Redis Cache]
    B --> H[React Components]
    H --> I[Context API]
```

### **🛡️ Segurança**

- **🔐 Autenticação JWT** - Tokens seguros com expiração
- **🛡️ Middleware** - Proteção de rotas sensíveis
- **🔒 HTTPS** - Comunicação criptografada
- **🚫 CORS** - Controle de origem de requisições
- **🔑 Hashing** - Senhas com bcrypt
- **📝 Validação** - Sanitização de inputs

---

## 🤝 **Contribuição**

Contribuições são muito bem-vindas! Este projeto serve à comunidade católica mundial.

### **🚀 Como Contribuir**

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/SEU_USUARIO/liturgia-isaias.git`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Faça** suas alterações
5. **Teste** suas mudanças: `npm run test`
6. **Commit**: `git commit -m "feat: adiciona nova funcionalidade"`
7. **Push**: `git push origin feature/nova-funcionalidade`
8. **Abra** um Pull Request

### **📋 Guidelines**

- **🧪 Testes** - Adicione testes para novas funcionalidades
- **📝 Documentação** - Atualize a documentação quando necessário
- **🎨 Código** - Siga os padrões ESLint e Prettier
- **💬 Commits** - Use [Conventional Commits](https://www.conventionalcommits.org/)
- **🐛 Issues** - Reporte bugs com detalhes e reprodução

### **🏷️ Tipos de Contribuição**

- 🐛 **Bug fixes** - Correção de problemas
- ✨ **Features** - Novas funcionalidades
- 📝 **Documentação** - Melhorias na documentação
- 🎨 **UI/UX** - Melhorias na interface
- ⚡ **Performance** - Otimizações
- 🧪 **Testes** - Adição de testes
- 🔧 **Configuração** - Melhorias na configuração

---

## 📊 **Status do Projeto**

### **✅ Funcionalidades Implementadas**

- [x] Sistema de autenticação completo
- [x] Dashboard principal com estatísticas
- [x] Gerenciamento de usuários
- [x] Interface responsiva
- [x] PWA funcional
- [x] Deploy na Vercel

### **🚧 Em Desenvolvimento**

- [ ] Biblioteca de músicas completa
- [ ] Sistema de upload de PDFs
- [ ] Calendário litúrgico integrado
- [ ] Modo apresentação
- [ ] Transposição de cifras
- [ ] Notificações push

### **🎯 Roadmap**

#### **v1.1 - Biblioteca Musical**
- Upload e OCR de partituras
- Sistema de tags avançado
- Busca inteligente
- Favoritos e playlists

#### **v1.2 - Planejamento Litúrgico**
- Calendário litúrgico completo
- Sugestões automáticas
- Templates de missa
- Histórico de repertórios

#### **v1.3 - Apresentação**
- Modo projeção
- Controles de apresentação
- Temas personalizáveis
- Sincronização multi-tela

#### **v2.0 - Recursos Avançados**
- Integração com YouTube
- Transposição automática
- Colaboração em tempo real
- API pública

---

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 Clenio Afonso

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 **Agradecimentos**

### **🎵 Inspiração**
Este projeto foi criado para servir à **Igreja Católica** e aos **ministérios de música** ao redor do mundo, facilitando a organização e planejamento de repertórios litúrgicos.

### **👥 Comunidade**
Agradecemos a todos os **músicos**, **padres**, **coordenadores de liturgia** e **desenvolvedores** que contribuem para este projeto.

### **🛠️ Tecnologias**
Gratidão às comunidades open-source que tornaram este projeto possível:
- [Next.js](https://nextjs.org/) - Framework React
- [Vercel](https://vercel.com/) - Hospedagem e deploy
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Prisma](https://www.prisma.io/) - ORM moderno

---

<div align="center">

### **🎵 Que Deus abençoe este projeto e todos os ministérios que o utilizarão! ✨**

**Desenvolvido com ❤️ e 🙏 pela Equipe BMAD-METHOD**

[⭐ **Star no GitHub**](https://github.com/clenio77/liturgia-isaias) • [🐛 **Reportar Bug**](https://github.com/clenio77/liturgia-isaias/issues) • [💡 **Sugerir Feature**](https://github.com/clenio77/liturgia-isaias/issues) • [💬 **Discussões**](https://github.com/clenio77/liturgia-isaias/discussions)

---

**📧 Contato:** [clenioti@gmail.com](mailto:clenioti@gmail.com)
**🌐 Website:** [liturgia-isaias.vercel.app](https://liturgia-isaias.vercel.app)
**📱 PWA:** Instalável em todos os dispositivos

</div>
