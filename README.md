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

Para testar num telemóvel ou tablet na mesma rede Wi-Fi: `npm run dev:lan` e abra o endereço
`http://<IP-do-computador>:5173` que o Vite mostra no terminal (o Windows pode pedir para permitir
o Node na firewall da rede privada).

## Publicação (GitHub Pages) e instalação no iPhone

A app está publicada em **<https://domustech.github.io/yoga-planner/>**. Cada `git push` para `main`
corre o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que faz
`npm run build:pages` (build com base `/yoga-planner/`), copia `index.html` para `404.html`
(fallback para as rotas da SPA) e publica a pasta `dist/` no GitHub Pages.

A app é uma **PWA**: tem manifest, ícones e service worker (gerados por `vite-plugin-pwa`), por isso
pode ser instalada e funciona offline depois da primeira visita.

Instalar no iPhone / iPad:

1. Abrir o endereço acima no **Safari** (tem de ser o Safari).
2. Tocar no botão **Partilhar** (quadrado com seta) e escolher **Adicionar ao ecrã principal**.
3. Confirmar o nome "Yoga Planner". O ícone aparece no ecrã principal e a app abre a ecrã inteiro.

Em Android (Chrome): menu ⋮ → **Instalar aplicação**.

Notas:
- Os dados (aulas) ficam guardados no próprio dispositivo; a app instalada no iPhone não partilha dados
  com o browser do computador. Use **Exportar / Importar** para passar aulas entre dispositivos.
- Para imprimir a partir do iPhone use o botão **PDF** e escolha **Imprimir** na folha de partilha
  (a impressão direta do browser não funciona na app instalada no ecrã principal).
- Em ecrãs estreitos, arrastar da biblioteca para as fases não está disponível: use o botão **+** de cada
  postura (adiciona à fase selecionada). Dentro de uma fase, arraste pela pega ⋮⋮ com toque longo.
- Para pré-visualizar localmente a build tal como fica no Pages: `npm run build:pages && npm run preview:pages`
  e abrir <http://localhost:4173/yoga-planner/>.
- Para regenerar os ícones (a partir do SVG em `scripts/generate-icons.mjs`): `npm run icons`.

## Funcionalidades

- **Aulas**: criar, duplicar, apagar, importar/exportar (JSON). Cada aula tem nome, nível, duração alvo e tema.
- **Criar aula automática** (wizard): em seis passos escolhe-se o tipo de aula (Hatha clássica, suave, dinâmica,
  restaurativa, pranayama e meditação), duração (30–90 min), nível, efeito pretendido (calmante, energizante,
  equilibrante), focos corporais e chakras, opções (Saudação ao Sol, inversões, mudras, Yoga Nidra) e acessórios
  disponíveis. O gerador (`src/lib/classGenerator.ts`) distribui o tempo pelas fases segundo o tipo, escolhe
  posturas por pontuação (efeito, chakras, foco, nível), ordena o chão de forma lógica, junta contra-posturas às
  extensões e inversões, anota variações com os acessórios escolhidos e acerta as durações ao minuto. A
  pré-visualização permite pedir "Outra sugestão" antes de criar; a aula fica depois editável como qualquer outra.
  `npm run gen:smoke` valida 150 combinações (duração exata, níveis, sem repetições).
- **Fases da aula**: cada aula nova começa com a estrutura clássica de Hatha
  (Centramento → Pranayama → Aquecimento → Saudação ao Sol → Posturas em pé → Posturas no chão →
  Inversões → Relaxamento final → Meditação e encerramento). As fases podem ser renomeadas,
  reordenadas, removidas ou criadas de raiz; cada fase tem notas e categorias sugeridas.
- **Biblioteca** com 123 posturas e práticas (asanas, pranayamas, mudras e bandhas, aquecimentos, relaxamento
  e meditação), cada uma com nome em português, sânscrito e inglês, categorias, nível, duração sugerida,
  respiração, benefícios, precauções, dicas de instrução, **efeitos subtis** (energéticos, mentais, emocionais),
  **efeito predominante** (calmante, energizante, equilibrante), **chakras** e **variações** com acessórios
  (cinto, bastão, bloco, manta, almofada, parede, cadeira).
- **Filtros por intenção**: a biblioteca filtra por tipo (asanas, pranayama, mudras, práticas), nível, efeito,
  chakra e acessório. Com um efeito ou chakra escolhido (ex.: calmante + coração), a lista agrupa-se em
  pranayama, mudras, asanas e práticas para montar a aula.
- **Saber** (rota `/saber`): conhecimento de apoio para meditações e conversas com alunos: caminhos do Yoga,
  os oito membros e sutras essenciais de Patanjali, Vedanta básico (na linha de Swami Dayananda Saraswati),
  chakras ligados à biblioteca, roteiros de meditação e glossário, com pesquisa.
- **Duas ilustrações por postura**: nos cartões, no editor, na impressão e no PDF usa-se a figura esquemática
  ("boneco de linha") gerada por SVG a partir das articulações; ao abrir o detalhe de uma postura aparece uma
  **ilustração em aquarela** gerada pela app a partir da mesma geometria (`WatercolorFigure`): a mesma personagem
  em todas (cabelo apanhado, top verde-sálvia, leggings verde-água), com manchas, salpicos e grão de papel em
  tons pastel. Se existir uma imagem própria em `public/poses/<id>.webp`, ela substitui a aquarela gerada; o fluxo
  para criar e importar imagens está em [`docs/imagens/README.md`](docs/imagens/README.md). A página `/figuras`
  mostra todas as aquarelas e `node scripts/render-watercolor.mjs <pasta>` exporta-as em PNG (folhas de contacto
  ou, com `--por-postura`, uma imagem por postura).
- **Alinhamento**: ao clicar numa postura, a secção "Alinhamento — o que a postura deve assegurar" lista as
  indicações parte a parte (pés, pernas, joelhos, ancas, coluna, peito, ombros, braços, mãos, cabeça, olhar,
  respiração, atenção) e os erros comuns, para todas as 123 posturas e práticas (`src/data/alinhamento/`).
  No editor, cada postura da aula tem a mesma lista em "Alinhamento: o que assegurar".
- **Editor**: arrastar e largar da biblioteca para as fases, reordenar dentro da fase, mover entre fases,
  duração por postura (m:ss, botões ±15 s), indicação de posturas bilaterais, notas por postura,
  barra cronológica colorida por categoria e comparação com a duração alvo.
- **Exportar PDF**: o botão **PDF** (no editor, na lista de aulas e na vista de impressão) gera no próprio
  dispositivo um PDF A4 com cabeçalho, barra cronológica e, por fase, os cartões das posturas com as figuras
  em vetor, durações e notas. No iPhone/iPad abre a folha de partilha (Imprimir, Guardar em Ficheiros, Mail,
  AirDrop…); no computador descarrega o ficheiro. Código em `src/lib/pdf/classPdf.ts` (jsPDF, carregado só
  quando é preciso); `npm run pdf:smoke` gera um PDF de exemplo para rever o layout.
- **Impressão**: vista limpa da aula com as figuras (`Imprimir` no editor) para imprimir diretamente do browser.
- Funciona em desktop e tablet; em ecrãs estreitos a biblioteca abre como painel lateral.

## Estrutura do código

```
src/
  data/
    types.ts        Modelo de dados (Pose, YogaClass, ClassPhase, PoseFigure…)
    categories.ts   Categorias (cores, descrições), níveis, efeitos e acessórios
    chakras.ts      Os sete chakras (qualidades, práticas, reflexões)
    conhecimento.ts Caminhos do Yoga, Patanjali, Vedanta, roteiros de meditação, glossário
    phases.ts       Modelo de fases de uma aula de Hatha
    poses.ts        Biblioteca de posturas (conteúdo + figuras)
  components/
    PoseFigure.tsx  Renderizador SVG das figuras a partir das articulações
    LibraryPanel, PoseCard, PhaseSection, ClassItemRow, DurationControl,
    PoseDetails (modal), ClassTimeline, CategoryChip
  pages/
    ClassesPage     Lista de aulas
    ClassEditorPage Editor (fases + biblioteca, drag & drop)
    LibraryPage     Galeria de posturas (filtros por tipo, nível, efeito, chakra, acessório)
    KnowledgePage   Saber: conhecimento de apoio (/saber)
    PrintPage       Vista de impressão (/aula/:id/imprimir)
    FiguresPage     Revisão de todas as figuras (/figuras, sem link no menu)
  store/
    useClassStore.ts  Estado das aulas (zustand + persistência em localStorage)
  lib/
    utils.ts, classFactory.ts
```

Stack: Vite, React 19, TypeScript, zustand, @dnd-kit, react-router, lucide-react, vite-plugin-pwa. Sem backend.

## Como adicionar uma postura

Em `src/data/poses.ts`, acrescentar um objeto ao array `POSES` (ver `Pose` em `types.ts`: além do conteúdo
descritivo, preencher `efeito`, `chakras`, `efeitosSubtis` e, se fizer sentido, `variacoes` com `acessorios`).
A figura é definida por pontos num
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
7. App nativa (Capacitor) para a App Store, se a PWA deixar de chegar.
