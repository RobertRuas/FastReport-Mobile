# FastReport Mobile

Web app para iPhone que organiza fotos de trabalho, como o FastReport para Mac: projetos a partir de mapas (T1–T24, Retrofit de tendões), triagem com toques, revisão com arrastar, exportação em ZIP com as mesmas pastas e nomes.

Tudo fica no iPhone (IndexedDB). Sem contas nem nuvem.

## Correr na rede local (Mac)

```bash
cd ~/Projects/FastReport-Mobile
sh serve.sh
```

O script mostra o endereço (ex.: `http://192.168.1.20:4173`). Abre-o no Safari do iPhone, na mesma rede Wi‑Fi, e usa Partilhar → "Adicionar ao ecrã principal".

Limites em HTTP na rede local:
- Sem modo offline (o iOS só permite o service worker em HTTPS).
- Os dados ficam ligados ao endereço: se o IP do Mac mudar, a app abre vazia nesse novo endereço.

Para uso real no terreno, usa o endereço HTTPS do GitHub Pages: cada push para `main` publica a app automaticamente (`.github/workflows/pages.yml`). Aí a app funciona sem rede e os dados ficam sempre no mesmo sítio.

Endereço: https://robertruas.github.io/FastReport-Mobile/

## Desenvolver

```bash
npm install
npm run dev     # servidor de desenvolvimento na rede local (porta 5173)
npm run build   # gera dist/ (inclui sw.js para o modo offline)
```

| O quê | Onde |
|---|---|
| Ecrãs | `src/screens/` (Home, NewProject, Project, Review, Triage, Viewer, Export, Settings) |
| Peças de UI | `src/components/` |
| Estado e regras (mover, desfazer, importar, exportar) | `src/lib/state.svelte.js` |
| Base de dados local | `src/lib/db.js` |
| ZIP (criar e ler) | `src/lib/zip.js` |
| Textos PT/EN | `src/lib/i18n.svelte.js` |
| Mapas (iguais ao Mac) | `src/lib/*.json` |
| Service worker | `sw-template.js` + plugin em `vite.config.js` |

## Formato do ZIP

```
<Nome do projeto>/
  fastreport.json        {createdAt, displayName, mapId, schemaVersion}
  Inbox/  General/  Trash/  T1/ … T24/     (ou C12/T01…, C25/T01… no mapa de tendões)
  T10/<slug>_T10_1.jpeg …
```

Descomprimido, abre no FastReport para Mac. Um ZIP destes (do Mac ou de outro iPhone) também se importa na app: Projetos → + → Importar ZIP.
