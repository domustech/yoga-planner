# Ilustrações das posturas (aquarela)

Ao abrir o detalhe de uma postura, a app mostra uma ilustração em aquarela **gerada por ela própria**
a partir das articulações da postura (componente `WatercolorFigure`): a mesma personagem em todas,
com manchas, salpicos e grão de papel. Nos cartões e no editor continuam a usar-se as figuras
esquemáticas de linha.

Se existir uma imagem própria em `public/poses/<id>.webp` (por exemplo pintada por um gerador de
imagens a partir dos prompts abaixo), ela substitui a aquarela gerada no detalhe. Para exportar as
aquarelas geradas em PNG: `node scripts/render-watercolor.mjs <pasta> [--por-postura]`.

Estilo de referência: aguarela solta, fundo branco, salpicos leves de tinta, a mesma personagem
em todas as imagens (cabelo castanho-claro apanhado, top verde-azeitona, leggings azul-esverdeadas).
Guarde a imagem de referência como `docs/imagens/referencia.png` para a usar como "style reference"
nos geradores que o permitem.

## Fluxo

1. **Gerar os prompts**: `npm run imagens:prompts` cria `docs/imagens/prompts.md` (tabela legível),
   `prompts.csv` e `prompts.json` com um prompt em inglês por postura. As descrições visuais estão em
   `scripts/pose-visuals.mjs` e podem ser afinadas.
2. **Criar as imagens** num gerador (ChatGPT/DALL·E, Midjourney, Gemini, Ideogram, Stable Diffusion…),
   em formato quadrado (1024×1024 ou mais). Guardar cada imagem com o nome do ficheiro indicado,
   que é o **id da postura** (ex.: `trikonasana.png`, `virabhadrasana-2.png`), numa pasta à escolha.
3. **Importar**: `npm run imagens:importar -- <pasta>`. O script recorta margens brancas, encaixa num
   quadrado de 640 px com fundo branco, converte para WebP e regenera `src/data/poseImages.ts`.
   Ficheiros com nomes que não correspondem a posturas são listados e ignorados.
4. **Rever** em `/figuras`: mostra todas as posturas, com a etiqueta "sem imagem" nas que faltam.
5. **Publicar**: commit e push; o GitHub Pages atualiza a app.

Para substituir uma ilustração basta importar de novo um ficheiro com o mesmo id.

## Dicas para resultados consistentes

- Gerar em lotes pequenos e verificar a anatomia (número de braços e pernas, lado da torção).
- Para posturas assimétricas, a imagem mostra apenas um lado; a app indica "2 lados".
- Se o gerador insistir em adicionar texto ou tapete decorado, reforçar "no text, plain white background".
- Mudras: o prompt pede um close-up das mãos ou do rosto; se preferir corpo inteiro, altere a descrição
  em `scripts/pose-visuals.mjs`.
