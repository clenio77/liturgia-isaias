# 🤝 **Guia de Contribuição - Liturgia Isaías**

Obrigado por considerar contribuir com o **Sistema Liturgia Isaías**! Este projeto serve à comunidade católica mundial e suas contribuições são muito valiosas.

## 📋 **Índice**

- [🚀 Como Contribuir](#-como-contribuir)
- [🐛 Reportando Bugs](#-reportando-bugs)
- [💡 Sugerindo Funcionalidades](#-sugerindo-funcionalidades)
- [🔧 Configuração do Ambiente](#-configuração-do-ambiente)
- [📝 Padrões de Código](#-padrões-de-código)
- [🧪 Testes](#-testes)
- [📖 Documentação](#-documentação)

---

## 🚀 **Como Contribuir**

### **1. Fork e Clone**
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USUARIO/liturgia-isaias.git
cd liturgia-isaias

# Adicione o repositório original como upstream
git remote add upstream https://github.com/clenio77/liturgia-isaias.git
```

### **2. Crie uma Branch**
```bash
# Crie uma branch para sua contribuição
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b fix/nome-do-bug
```

### **3. Faça suas Alterações**
- Siga os [padrões de código](#-padrões-de-código)
- Adicione testes quando necessário
- Atualize a documentação se aplicável

### **4. Teste suas Alterações**
```bash
# Execute os testes
npm run test

# Verifique o linting
npm run lint

# Teste o build
npm run build
```

### **5. Commit e Push**
```bash
# Adicione suas alterações
git add .

# Faça commit seguindo Conventional Commits
git commit -m "feat: adiciona nova funcionalidade de upload"

# Push para seu fork
git push origin feature/nome-da-funcionalidade
```

### **6. Abra um Pull Request**
- Vá para o GitHub e abra um Pull Request
- Descreva suas alterações claramente
- Referencie issues relacionadas

---

## 🐛 **Reportando Bugs**

### **Antes de Reportar**
- Verifique se o bug já foi reportado nas [Issues](https://github.com/clenio77/liturgia-isaias/issues)
- Teste na versão mais recente
- Verifique se não é um problema de configuração

### **Como Reportar**
Use o template de bug report:

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 91]
- Versão: [ex: 1.0.0]
```

---

## 💡 **Sugerindo Funcionalidades**

### **Antes de Sugerir**
- Verifique se a funcionalidade já foi sugerida
- Considere se é relevante para a comunidade católica
- Pense na implementação e manutenção

### **Como Sugerir**
Use o template de feature request:

```markdown
**Problema Relacionado**
Descreva o problema que esta funcionalidade resolveria.

**Solução Proposta**
Descrição clara da funcionalidade desejada.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Contexto Adicional**
Qualquer informação adicional relevante.
```

---

## 🔧 **Configuração do Ambiente**

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 14+
- Git

### **Configuração**
```bash
# Clone e instale dependências
git clone https://github.com/clenio77/liturgia-isaias.git
cd liturgia-isaias
npm install

# Configure o ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Configure o banco
npm run db:migrate
npm run db:seed

# Inicie o desenvolvimento
npm run dev
```

---

## 📝 **Padrões de Código**

### **Estilo de Código**
- Use **TypeScript** para type safety
- Siga as configurações do **ESLint** e **Prettier**
- Use **TailwindCSS** para estilização
- Prefira **componentes funcionais** com hooks

### **Convenções de Nomenclatura**
- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Arquivos**: kebab-case (`user-profile.utils.ts`)
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### **Estrutura de Componentes**
```tsx
'use client' // Se necessário

import { useState } from 'react'
import { ComponentProps } from './types'

interface Props extends ComponentProps {
  // Props específicas
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks
  const [state, setState] = useState()

  // Handlers
  const handleClick = () => {
    // Lógica
  }

  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}
```

### **Commits**
Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

---

## 🧪 **Testes**

### **Tipos de Testes**
- **Unit Tests** - Componentes e funções isoladas
- **Integration Tests** - Fluxos completos
- **E2E Tests** - Testes de ponta a ponta

### **Executando Testes**
```bash
# Todos os testes
npm run test

# Testes em watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### **Escrevendo Testes**
```tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

---

## 📖 **Documentação**

### **Atualizando Documentação**
- Atualize o README.md se necessário
- Documente novas APIs
- Adicione comentários JSDoc em funções complexas
- Atualize o CHANGELOG.md

### **JSDoc**
```tsx
/**
 * Calcula a transposição de uma cifra musical
 * @param chord - A cifra original (ex: "C", "Am")
 * @param semitones - Número de semitons para transpor
 * @returns A cifra transposta
 */
function transposeChord(chord: string, semitones: number): string {
  // Implementação
}
```

---

## 🏷️ **Labels e Issues**

### **Labels Principais**
- `bug` - Problemas e erros
- `enhancement` - Melhorias e novas funcionalidades
- `documentation` - Relacionado à documentação
- `good first issue` - Bom para iniciantes
- `help wanted` - Precisa de ajuda da comunidade
- `priority: high` - Alta prioridade
- `liturgy` - Específico da liturgia católica

---

## 🎯 **Áreas de Contribuição**

### **🎵 Liturgia e Música**
- Conhecimento de liturgia católica
- Teoria musical e cifras
- Calendário litúrgico

### **💻 Desenvolvimento**
- Frontend (React, Next.js, TypeScript)
- Backend (Node.js, Prisma, PostgreSQL)
- PWA e Service Workers
- Testes automatizados

### **🎨 Design e UX**
- Interface de usuário
- Experiência do usuário
- Acessibilidade
- Design responsivo

### **📝 Documentação**
- Documentação técnica
- Guias de usuário
- Tradução
- Exemplos e tutoriais

---

## 🌍 **Comunidade**

### **Canais de Comunicação**
- **GitHub Issues** - Bugs e funcionalidades
- **GitHub Discussions** - Discussões gerais
- **Email** - clenioti@gmail.com

### **Código de Conduta**
Este projeto segue o [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em seguir estes termos.

---

## 🙏 **Agradecimentos**

Agradecemos a todos os contribuidores que ajudam a tornar este projeto melhor para a comunidade católica mundial!

**Que Deus abençoe suas contribuições! ✨**

---

*Para dúvidas sobre contribuições, abra uma [Discussion](https://github.com/clenio77/liturgia-isaias/discussions) ou envie um email para clenioti@gmail.com*
