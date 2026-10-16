# Ilustrações das posturas (aquarela)

A app mostra, para cada postura, uma ilustração em aquarela quando ela existe em
`public/poses/<id>.webp`; caso contrário usa a figura esquemática gerada por SVG.
Assim é possível ir substituindo as figuras pelas ilustrações aos poucos.

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
