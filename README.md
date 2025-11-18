# Visualizador / Editor 3D para Impressão

Projeto React + TypeScript para visualização, edição e preparação de modelos 3D para impressão (carregamento de STL, transformação, cálculo de volume/peso e estimativa de custo).

- Tecnologias principais:
  - Vite, React, TypeScript
  - Tailwind CSS (estilos)
  - Three.js + @react-three/fiber + @react-three/drei (render 3D)
  - React Router (rotas)
  - TanStack Query
  - Diversos componentes UI (Radix / utilitários customizados)

Funcionalidades
- Carregamento de arquivos STL via interface (`FileUpload`).
- Visualização 3D com orbit controls e câmera (`ModelViewer`, `Editor3DView`).
- Lista de modelos, seleção, visibilidade, bloqueio, duplicação e remoção (`ModelList`).
- Painel de transformação (mover, rotacionar, escalar), centrar e posicionar na mesa (`TransformPanel`).
- Cálculo de volume, dimensão e peso do modelo e estimativa de custo (`modelCalculations`, `CostCalculator`, `ProjectSummary`).
- Configurações de impressão (layer height, infill, paredes, etc.) salvas em localStorage.
- Tema claro/escuro e atalhos de teclado (G, R, S, Delete).

Estrutura do projeto (resumo)
- `index.html` — página HTML principal.
- `src/main.tsx` — ponto de entrada; monta `App` e provê `ThemeProvider`.
- `src/App.tsx` — provê provedores (React Query, tooltips) e rotas (`/`, `/settings`).
- `src/pages/Index.tsx` — página principal com a interface do editor 3D (upload, lista, visualização e painéis).
- `src/components/` — componentes reutilizáveis do editor (ex.: `ModelViewer.tsx`, `Editor3DView.tsx`, `ModelList.tsx`, `FileUpload.tsx`, `TransformPanel.tsx`, `CostCalculator.tsx`, `ProjectSummary.tsx`).
- `src/utils/` — utilitários como `modelCalculations.ts` (volume, peso, dimensões) e `localStorage.ts`.
- `src/types/` — tipos TypeScript do domínio (ex.: `model.ts`).
- `tailwind.config.ts` / `postcss.config.js` — configuração do Tailwind.
- `package.json` — scripts e dependências.

Como executar (desenvolvimento)
1. Instalar dependências:

```bash
npm install
```

2. Iniciar servidor de desenvolvimento:

```bash
npm run dev
```

3. Abrir no navegador em `http://localhost:5173` (porta padrão do Vite).

Build e preview
- Gerar build de produção:

```bash
npm run build
```

- Servir build localmente:

```bash
npm run preview
```

Scripts úteis
- `npm run dev` — desenvolvimento com HMR.
- `npm run build` — build de produção.
- `npm run preview` — pré-visualizar build.
- `npm run lint` — rodar ESLint.

Uso rápido
- Na página inicial (`/`), clique em "Carregar STL" ou use o botão de upload para selecionar um arquivo. Ao carregar, o modelo aparece na lista e na visualização 3D.
- Selecione um modelo na lista para ajustar posição/rotação/escala no `TransformPanel`.
- Use "Centralizar" ou "Posicionar na mesa" para ajustar a colocação do modelo.
- Consulte `ProjectSummary` para ver volume, peso e estimativa de custo (usa configurações de filamento/impresora do `localStorage`).
- As configurações de impressão são salvas automaticamente no navegador.

Considerações e extensões sugeridas
- Suporte a vários formatos além de STL (ex.: OBJ, GLTF).
- Exportar projeto/preset de impressão.
- Geração de suporte automático e verificação de colisões/overhangs.
- Integração com slicers ou exportação para formatos compatíveis com impressoras.

Contribuição
- Abra issues ou PRs no repositório. Siga as regras de lint/prettier do projeto.

Licença
- Adicione aqui a licença desejada (ex.: MIT).


