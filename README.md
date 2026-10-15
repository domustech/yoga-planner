# Yoga Planner

Aplicação web para **planeamento e desenho de aulas de Hatha Yoga**, pensada para instrutores.
Permite construir uma aula fase a fase, arrastando posturas de uma biblioteca ilustrada,
ajustar durações e notas, e imprimir ou exportar o plano.

> Fase 1 (atual): uso individual por instrutores, dados guardados no browser.
> O projeto é evolutivo — ver "Roteiro" no fim.

## Arrancar

```bash
npm install
npm run dev
```

Abra <http://localhost:5173>. Para gerar a versão de produção: `npm run build` (saída em `dist/`).

## Funcionalidades

- **Aulas**: criar, duplicar, apagar, importar/exportar (JSON). Cada aula tem nome, nível, duração alvo e tema.
- **Fases da aula**: cada aula nova começa com a estrutura clássica de Hatha
  (Centramento → Pranayama → Aquecimento → Saudação ao Sol → Posturas em pé → Posturas no chão →
  Inversões → Relaxamento final → Meditação e encerramento). As fases podem ser renomeadas,
  reordenadas, removidas ou criadas de raiz; cada fase tem notas e categorias sugeridas.
- **Biblioteca** com 73 posturas e práticas (asanas, pranayamas, aquecimentos, relaxamento e meditação),
  cada uma com nome em português, sânscrito e inglês, categorias, nível, duração sugerida, respiração,
  benefícios, precauções e dicas de instrução.
- **Figuras ilustrativas** geradas por SVG a partir das articulações de cada postura (sem imagens externas).
- **Editor**: arrastar e largar da biblioteca para as fases, reordenar dentro da fase, mover entre fases,
  duração por postura (m:ss, botões ±15 s), indicação de posturas bilaterais, notas por postura,
  barra cronológica colorida por categoria e comparação com a duração alvo.
- **Impressão / PDF**: vista limpa da aula com as figuras, pronta para imprimir (`Imprimir` no editor).
- Funciona em desktop e tablet; em ecrãs estreitos a biblioteca abre como painel lateral.

## Estrutura do código

```
src/
  data/
    types.ts        Modelo de dados (Pose, YogaClass, ClassPhase, PoseFigure…)
    categories.ts   Categorias (cores, descrições) e níveis
    phases.ts       Modelo de fases de uma aula de Hatha
    poses.ts        Biblioteca de posturas (conteúdo + figuras)
  components/
    PoseFigure.tsx  Renderizador SVG das figuras a partir das articulações
    LibraryPanel, PoseCard, PhaseSection, ClassItemRow, DurationControl,
    PoseDetails (modal), ClassTimeline, CategoryChip
  pages/
    ClassesPage     Lista de aulas
    ClassEditorPage Editor (fases + biblioteca, drag & drop)
    LibraryPage     Galeria de posturas
    PrintPage       Vista de impressão (/aula/:id/imprimir)
    FiguresPage     Revisão de todas as figuras (/figuras, sem link no menu)
  store/
    useClassStore.ts  Estado das aulas (zustand + persistência em localStorage)
  lib/
    utils.ts, classFactory.ts
```

Stack: Vite, React 19, TypeScript, zustand, @dnd-kit, react-router, lucide-react. Sem backend.

## Como adicionar uma postura

Em `src/data/poses.ts`, acrescentar um objeto ao array `POSES`. A figura é definida por pontos num
quadrado 0–100 (chão em y≈88): `head`, `neck`, `pelvis`, `spine` (opcional, curva o tronco),
`arms` = [ombro, cotovelo, pulso] e `legs` = [anca, joelho, tornozelo, ponta do pé].
Em vista lateral (`view: 'side'`), se só houver um braço/perna ele é duplicado automaticamente
(membro de trás mais claro). A página `/figuras` mostra todas as figuras para revisão.

## Onde ficam os dados

As aulas são guardadas no `localStorage` do browser (chave `yoga-planner:aulas`).
Use **Exportar** para guardar uma cópia em JSON e **Importar** para a repor noutro dispositivo.

## Roteiro (ideias para as próximas fases)

1. Fotografias/ilustrações reais por postura (upload pelo instrutor) com fallback para a figura SVG.
2. Contas de utilizador e sincronização na nuvem (partilha de aulas entre instrutores).
3. Modo "dar aula": cronómetro por postura, ecrã grande, avanço automático.
4. Variantes e progressões de cada postura, contra-posturas automáticas, avisos de sequência
   (ex.: inversão sem contra-postura).
5. Modelos de aula por tema (ancas, costas, relaxamento) e geração assistida de sequências.
6. Outras linhagens além do Hatha (Vinyasa, Yin, Restaurativo) e aulas para alunos.
7. PWA instalável e uso offline.
