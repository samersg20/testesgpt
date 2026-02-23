# SafeLabel MVP

MVP web para etiquetas de segurança alimentar em restaurante com impressão térmica Zebra ZD220t via QZ Tray.

## Stack
- Repositório: `samersg20/safelabel`

## Repositório
- GitHub: https://github.com/samersg20/safelabel

- Next.js (App Router, TypeScript)
- Prisma + SQLite
- Auth.js (NextAuth Credentials)
- QZ Tray (raw ZPL)

## Como rodar
1. Instale dependências:
   ```bash
   npm install
   ```
2. Gere e aplique migração:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Rode seed inicial:
   ```bash
   npm run prisma:seed
   ```
4. Inicie aplicação:
   ```bash
   npm run dev
   ```

## Usuários seed
- admin@safelabel.local / 123456
- operador@safelabel.local / 123456

## Fluxo de impressão Zebra + QZ Tray
1. Instale driver da Zebra ZD220t no sistema operacional.
2. Instale e abra QZ Tray: https://qz.io/download/
3. Faça login no SafeLabel.
4. Cadastre itens em `/items` com shelf life por método.
5. Em `/print`, selecione item + método + quantidade e clique **IMPRIMIR**.
6. O sistema cria o registro em banco e envia ZPL raw automaticamente para a impressora.

### Seleção de impressora
- O front tenta selecionar automaticamente uma impressora contendo `ZDesigner ZD220` no nome.
- Se não encontrar, permite buscar impressoras e escolher manualmente.
- A escolha é salva em `localStorage` (`safelabel-printer`).

## Observações QZ assinatura
- Em desenvolvimento, o app funciona no modo sem assinatura (diálogos do QZ Tray).
- Há placeholder em `qz-signing/README.md` para preparo de assinatura em produção.

## Rotas principais
- `/login`
- `/items`
- `/print`
- `/history`
