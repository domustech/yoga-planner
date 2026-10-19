# Ilustrações das posturas

As 123 posturas têm uma ilustração própria em `public/poses/<id>.webp` (importadas a 19/10/2026 do
conjunto `hatha_yoga_imagens.zip`: personagem única, fundo creme, círculo sálvia e tapete; originais
1024×1536 PNG, convertidas para 720 px WebP com o fundo original). Aparecem no detalhe da postura, em
`/figuras` e no PDF da aula. Nos cartões e no editor continuam a usar-se as figuras esquemáticas de linha.

Quando uma postura não tem imagem, o detalhe mostra a ilustração editorial gerada pela app
(componente `FlatFigure`). Para exportar as ilustrações geradas em PNG:
`node scripts/render-watercolor.mjs <pasta> [--por-postura] [--estilo flat|aquarela|silhueta]`
(amostra em `docs/imagens/amostras/biblioteca-editorial-amostra.png`).

O importador aceita ficheiros `<id>.png|jpg|webp`; nomes com prefixo numérico ou em sânscrito
(ex.: `03_em_pe/04_virabhadrasana_2.png`) precisam de ser renomeados para o id da postura antes
(ver a tabela de ids em `docs/posturas.md` ou `src/data/poses.ts`).

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
