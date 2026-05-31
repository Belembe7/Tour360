This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Vercel (este repo)

Este projeto esta dentro da pasta `tour360/` (monorepo). Ja existe um `vercel.json` na raiz do repo para a Vercel usar os comandos correctos.

#### Variaveis de ambiente

Configure no painel da Vercel (Project → Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (se usar emails)
- `NEXT_PUBLIC_APP_URL` (ex.: `https://<seu-projeto>.vercel.app`)

Use o ficheiro `.env.local.example` como referencia.

#### Supabase — confirmacao de email (importante)

No painel [Supabase](https://supabase.com/dashboard) → **Authentication** → **URL Configuration**:

1. **Site URL:** `https://tour360-cyan.vercel.app` (nao use `http://localhost:3000` em producao)
2. **Redirect URLs** — adicione todas:
   - `https://tour360-cyan.vercel.app/**`
   - `http://localhost:3000/**` (apenas para desenvolvimento local)

Sem isto, o link do email de confirmacao abre `localhost` no telemovel e da erro `ERR_CONNECTION_REFUSED`.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
