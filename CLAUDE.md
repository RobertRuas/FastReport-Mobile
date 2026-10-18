# FastReport Mobile

## Como trabalhar neste repositório

- Trabalha sempre diretamente na branch `main`. Não cries branches nem pull requests: faz commit e push para `main`.
- Cada push para `main` publica a app no GitHub Pages (`.github/workflows/pages.yml`). Antes do push, corre `npm run build` e confirma que passa.
- Ao lançar uma versão nova, atualiza o número em `package.json` e em `src/screens/Settings.svelte`.
- Mensagens de commit e textos para o utilizador em português.
