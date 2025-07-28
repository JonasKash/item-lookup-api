# Sistema de Controle de Estoque

Sistema completo para consulta e upload de planilhas de estoque com integração Git.

## 🚀 Funcionalidades

- **Consulta de Estoque**: Busca rápida de itens por código
- **Upload de Planilhas**: Interface drag & drop para arquivos Excel
- **Controle Git**: Commit automático das planilhas no repositório
- **Sincronização**: Atualização da base de dados com novas planilhas
- **Interface Moderna**: UI responsiva com Shadcn/ui

## 📋 Pré-requisitos

- Node.js 18+ 
- Git configurado no projeto
- Navegador moderno

## 🛠️ Instalação

1. **Clone o repositório**:
```bash
git clone <seu-repositorio>
cd item-lookup-api-main
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure o Git** (se necessário):
```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

## 🚀 Como Usar

### 1. Iniciar o Servidor Backend

Em um terminal, execute:
```bash
npm run server:dev
```

O servidor estará disponível em: `http://localhost:3001`

### 2. Iniciar o Frontend

Em outro terminal, execute:
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### 3. Usar o Sistema

#### Consulta de Estoque
1. Acesse `http://localhost:5173`
2. Digite o código do item no campo de busca
3. Visualize as informações do item

#### Upload de Planilhas
1. Acesse `http://localhost:5173/upload`
2. Arraste e solte arquivos Excel (.xlsx, .xls) na área de upload
3. Clique em "Fazer Commit" para enviar ao servidor
4. Use "Atualizar Base" para sincronizar os dados

## 📁 Estrutura do Projeto

```
item-lookup-api-main/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx      # Componente de upload
│   │   ├── Navigation.tsx      # Navegação
│   │   └── ...
│   ├── pages/
│   │   ├── Index.tsx           # Página de consulta
│   │   ├── Upload.tsx          # Página de upload
│   │   └── ...
│   └── ...
├── planilhas/                  # Pasta para arquivos Excel
├── server.js                   # Servidor Express
└── package.json
```

## 🔧 API Endpoints

### Upload de Arquivos
- **POST** `/api/upload`
- Aceita arquivos Excel (.xlsx, .xls)
- Salva na pasta `planilhas/`

### Git Commit
- **POST** `/api/commit`
- Faz commit das alterações no Git
- Body: `{ "message": "Mensagem do commit" }`

### Sincronização
- **POST** `/api/sync-database`
- Atualiza a base de dados

### Listar Arquivos
- **GET** `/api/files`
- Lista arquivos na pasta `planilhas/`

### Status
- **GET** `/api/status`
- Status do servidor

## 📊 Formato das Planilhas

As planilhas devem estar no formato Excel (.xlsx ou .xls) e conter as seguintes colunas:

- **Código**: Código do produto
- **Descrição**: Nome/descrição do produto
- **Estoque**: Quantidade em estoque
- **Preço**: Preço unitário
- **Localização**: Localização no depósito

## 🔄 Fluxo de Trabalho

1. **Upload**: Faça upload das planilhas via interface web
2. **Commit**: Execute o commit para salvar no Git
3. **Sincronização**: Atualize a base de dados
4. **Consulta**: Use a interface de consulta para buscar itens

## 🛡️ Segurança

- Validação de tipos de arquivo (apenas Excel)
- Sanitização de nomes de arquivo
- Controle de acesso via CORS
- Tratamento de erros robusto

## 🐛 Troubleshooting

### Erro no Upload
- Verifique se o arquivo é Excel (.xlsx, .xls)
- Confirme se o servidor está rodando na porta 3001
- Verifique as permissões da pasta `planilhas/`

### Erro no Git Commit
- Confirme se o Git está configurado
- Verifique se há alterações para commitar
- Confirme as credenciais do Git

### Servidor não inicia
- Verifique se a porta 3001 está livre
- Confirme se todas as dependências foram instaladas
- Verifique os logs de erro

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o frontend
- `npm run server` - Inicia o servidor backend
- `npm run server:dev` - Inicia o servidor com hot reload
- `npm run build` - Build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando React, TypeScript, Express e Shadcn/ui**
