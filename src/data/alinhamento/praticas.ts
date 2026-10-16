import type { Alinhamento } from '../types'

/**
 * Alinhamento das práticas que não são asanas: centramento, pranayama,
 * mudras e bandhas, aquecimentos, Saudação ao Sol, relaxamento e meditação.
 * Nos pranayamas e mudras a ênfase está na posição sentada, nas mãos e no rosto.
 */
export const ALINHAMENTO_PRATICAS: Record<string, Alinhamento> = {
  // ======================= CENTRAMENTO =====================================
  'chegada-intencao': {
    partes: {
      pes: 'Cruzados com conforto; tornozelos sem pressão.',
      ancas: 'Sentar sobre os ísquios, com almofada se os joelhos ficarem acima das ancas.',
      coluna: 'Ereta e leve, sem rigidez; crescer a partir da coroa.',
      ombros: 'Descem e abrem.',
      maos: 'Em prece ao peito (Anjali) ou pousadas nos joelhos.',
      cabeca: 'Queixo paralelo ao chão, maxilar solto, língua relaxada.',
      olhar: 'Olhos fechados ou semicerrados.',
      respiracao: 'Observar sem alterar; sentir os pontos de apoio e o peso do corpo.',
      atencao: 'Formular a intenção (sankalpa) em frase curta e afirmativa.',
    },
    erros: ['Começar a aula sem este momento de transição', 'Tensão nos ombros e no maxilar', 'Intenção demasiado longa ou negativa'],
  },
  'mantra-om': {
    partes: {
      coluna: 'Ereta, peito aberto para a vibração ressoar.',
      maos: 'Nos joelhos em Chin Mudra ou em prece.',
      cabeca: 'Maxilar solto; a boca abre no A, arredonda no U e fecha no M.',
      respiracao: 'Inspiração profunda e lenta; o OM ocupa toda a expiração, com o M mais longo (cerca de dois terços).',
      atencao: 'Sentir a vibração descer do abdómen (A) ao peito (U) e à cabeça (M); silêncio depois da última repetição.',
    },
    erros: ['Forçar o volume', 'Expirar todo o ar antes do M', 'Não respeitar o silêncio final'],
  },

  // ======================= PRANAYAMA =======================================
  'respiracao-abdominal': {
    partes: {
      ancas: 'Sentado com a bacia neutra, ou deitado com joelhos fletidos.',
      coluna: 'Longa; costelas da frente descontraídas.',
      ombros: 'Imóveis e relaxados; não sobem na inspiração.',
      maos: 'Uma ou as duas no baixo-ventre, para sentir o movimento.',
      cabeca: 'Rosto e maxilar soltos.',
      respiracao: 'Inspirar pelo nariz e deixar o abdómen expandir contra a mão; expirar e deixá-lo descer suavemente, sem empurrar.',
      atencao: 'Peito quase imóvel; o movimento vem do diafragma.',
    },
    erros: ['Empurrar a barriga com força', 'Elevar o peito e os ombros', 'Respirar demasiado depressa'],
  },
  'respiracao-completa': {
    partes: {
      coluna: 'Ereta, para as três zonas terem espaço.',
      ombros: 'Relaxados; sobem só ligeiramente na fase alta.',
      maos: 'Uma no abdómen, outra no peito, para distinguir as fases.',
      respiracao: 'Inspirar em três tempos contínuos: abdómen, costelas (alargam para os lados), parte alta do peito; expirar na ordem inversa, lentamente.',
      atencao: 'Sem pausas bruscas entre as fases; a inspiração é uma onda.',
    },
    erros: ['Fases desligadas, aos solavancos', 'Encher o peito à custa de tensão no pescoço', 'Expiração curta'],
  },
  'nadi-shodhana': {
    partes: {
      coluna: 'Ereta e imóvel.',
      ombros: 'O ombro direito não sobe com o braço; cotovelo solto junto ao corpo.',
      maos: 'Mão direita em Vishnu Mudra: indicador e médio dobrados para a palma; polegar fecha a narina direita, anelar (e mindinho) fecham a esquerda. Mão esquerda no joelho em Chin ou Jnana Mudra.',
      cabeca: 'Neutra; não inclinar para a mão.',
      olhar: 'Olhos fechados.',
      respiracao: 'Inspirar pela esquerda, fechar, expirar pela direita; inspirar pela direita, fechar, expirar pela esquerda. Ritmo lento e igual (ex.: 4-4, depois 4-8); fluxo suave e silencioso.',
      atencao: 'A pressão dos dedos é leve; nunca forçar a respiração nem reter antes de dominar o ritmo.',
    },
    erros: ['Cabeça inclinada e ombro levantado', 'Pressão forte no nariz', 'Respiração ruidosa ou acelerada'],
  },
  ujjayi: {
    partes: {
      coluna: 'Ereta, peito livre.',
      maos: 'Nos joelhos em Chin Mudra.',
      cabeca: 'Queixo ligeiramente recolhido; garganta suavemente contraída (como ao embaciar um espelho, mas de boca fechada).',
      olhar: 'Olhos fechados.',
      respiracao: 'Inspirar e expirar pelo nariz com um som suave e contínuo de oceano, igual nas duas fases; lenta e profunda.',
      atencao: 'O som é audível para o próprio, não para a sala.',
    },
    erros: ['Som demasiado forte e áspero', 'Tensão no rosto e no pescoço', 'Inspiração longa com expiração curta'],
  },
  kapalabhati: {
    partes: {
      ancas: 'Bem assentes; sentado com a coluna estável (Vajrasana ou Sukhasana).',
      coluna: 'Ereta e imóvel durante as expulsões.',
      ombros: 'Relaxados; não saltam com cada expiração.',
      maos: 'Nos joelhos em Chin Mudra.',
      cabeca: 'Rosto solto, olhos fechados.',
      respiracao: 'Expirações curtas e ativas pelo nariz, com contração rápida do baixo-ventre; a inspiração é passiva e acontece sozinha. Começar lento (1 por segundo), 20 a 30 por ronda; respirar normalmente entre rondas.',
      atencao: 'O movimento é só abdominal; terminar com uma inspiração profunda e uma retenção confortável.',
    },
    erros: ['Mover o peito e os ombros', 'Inspirar ativamente', 'Ritmo rápido demais com tonturas'],
  },
  bhastrika: {
    partes: {
      ancas: 'Assentes, base estável.',
      coluna: 'Ereta; o tronco não balança.',
      ombros: 'Relaxados.',
      maos: 'Nos joelhos em Chin Mudra (ou punhos junto aos ombros na variante com braços).',
      cabeca: 'Rosto solto.',
      respiracao: 'Inspirações e expirações vigorosas e de igual força, pelo nariz, com o diafragma; 10 a 20 por ronda, depois uma inspiração lenta e retenção confortável.',
      atencao: 'Parar imediatamente com tonturas; só depois de dominar Kapalabhati.',
    },
    erros: ['Forçar com o peito e o pescoço', 'Rondas longas demais', 'Praticar com o estômago cheio'],
  },
  bhramari: {
    partes: {
      coluna: 'Ereta, peito aberto.',
      ombros: 'Relaxados, cotovelos à altura dos ombros sem tensão.',
      maos: 'Indicadores fecham suavemente as orelhas (na cartilagem), ou Shanmukhi Mudra.',
      cabeca: 'Dentes ligeiramente afastados, lábios fechados, maxilar solto.',
      olhar: 'Olhos fechados.',
      respiracao: 'Inspirar profundamente; expirar com um zumbido suave e contínuo (como uma abelha), sentindo a vibração na cabeça; expiração longa e sem esforço.',
    },
    erros: ['Pressionar as orelhas com força', 'Zumbido agudo e forçado', 'Encolher os ombros'],
  },
  sitali: {
    partes: {
      coluna: 'Ereta.',
      maos: 'Nos joelhos.',
      cabeca: 'Língua enrolada em tubo para fora dos lábios (ou, se não conseguir, Sitkari: dentes juntos e lábios abertos).',
      respiracao: 'Inspirar lentamente pela língua, sentindo o ar fresco; fechar a boca e expirar pelo nariz, lentamente.',
      atencao: 'Evitar em ambientes frios ou com constipação.',
    },
    erros: ['Inspirar com pressa', 'Expirar pela boca', 'Tensão no maxilar'],
  },

  // ======================= MUDRAS E BANDHAS ===============================
  'jnana-mudra': {
    partes: {
      maos: 'Ponta do indicador toca a ponta do polegar; os outros três dedos estendidos e juntos, descontraídos; palmas viradas para baixo, pousadas nos joelhos.',
      bracos: 'Soltos; cotovelos levemente fletidos.',
      ombros: 'Relaxados.',
      atencao: 'Pressão leve entre os dedos; palmas para baixo favorece o enraizamento e a calma.',
    },
    erros: ['Dedos rígidos', 'Pressão forte entre indicador e polegar', 'Pulsos dobrados'],
  },
  'chin-mudra': {
    partes: {
      maos: 'Ponta do indicador toca a ponta do polegar (ou a base do polegar); os outros dedos estendidos; palmas viradas para cima, nos joelhos.',
      bracos: 'Soltos.',
      ombros: 'Relaxados, longe das orelhas.',
      atencao: 'Palmas para cima favorece a recetividade; manter sem esforço durante todo o pranayama.',
    },
    erros: ['Dedos a apertar', 'Ombros tensos', 'Palmas a fechar com o tempo'],
  },
  'chinmaya-mudra': {
    partes: {
      maos: 'Indicador e polegar unidos nas pontas; os outros três dedos dobrados para a palma, sem apertar; palmas para cima ou para baixo, nos joelhos.',
      respiracao: 'Observar: a respiração tende a sentir-se no peito e nas costelas.',
    },
    erros: ['Dedos dobrados com tensão', 'Pulsos em flexão'],
  },
  'adi-mudra': {
    partes: {
      maos: 'Polegar dobrado para a palma; os quatro dedos fecham suavemente sobre ele, formando um punho leve; palmas para baixo ou para cima, nos joelhos ou nas coxas.',
      respiracao: 'Observar: a respiração tende a sentir-se na parte alta do peito e nas clavículas.',
    },
    erros: ['Punho apertado', 'Braços rígidos'],
  },
  'brahma-mudra': {
    partes: {
      maos: 'Duas mãos em Adi Mudra, com os nós dos dedos em contacto e as palmas para cima, pousadas no colo junto ao umbigo.',
      coluna: 'Ereta.',
      respiracao: 'Observar a respiração completa, dos pulmões inteiros.',
    },
    erros: ['Mãos afastadas do corpo', 'Ombros a avançar'],
  },
  'anjali-mudra': {
    partes: {
      maos: 'Palmas unidas à frente do esterno, dedos juntos a apontar para cima, polegares a tocar levemente o peito; pressão igual nas duas mãos.',
      bracos: 'Cotovelos para baixo e um pouco afastados do tronco, sem elevar os ombros.',
      ombros: 'Descem.',
      cabeca: 'Neutra, ou ligeiramente inclinada em saudação.',
      atencao: 'Pode deixar-se um pequeno espaço entre as palmas, como a guardar algo.',
    },
    erros: ['Cotovelos levantados com ombros nas orelhas', 'Mãos afastadas do peito', 'Palmas a pressionar com força'],
  },
  'hridaya-mudra': {
    partes: {
      maos: 'Indicador dobrado até à base do polegar; pontas do médio e do anelar unem-se à ponta do polegar; mindinho estendido; palmas para cima, nos joelhos.',
      peito: 'Aberto, esterno leve.',
      respiracao: 'Lenta; levar a atenção ao centro do peito.',
    },
    erros: ['Forçar o indicador', 'Mindinho dobrado'],
  },
  'padma-mudra': {
    partes: {
      maos: 'Palmas à frente do peito: bases das mãos, polegares e mindinhos unidos; os outros seis dedos abrem-se como pétalas.',
      bracos: 'Cotovelos ligeiramente afastados, ombros soltos.',
      peito: 'Aberto.',
      atencao: 'Inspirar abrindo as pétalas, expirar fechando (Anjali) na versão dinâmica.',
    },
    erros: ['Dedos rígidos', 'Bases das mãos separadas'],
  },
  'dhyana-mudra': {
    partes: {
      maos: 'Mãos no colo, palmas para cima; mão direita sobre a esquerda (ou esquerda sobre a direita, conforme a tradição); as pontas dos polegares tocam-se levemente formando um oval.',
      bracos: 'Soltos; cotovelos ligeiramente afastados do tronco.',
      ombros: 'Descem.',
      atencao: 'Os polegares tocam-se sem pressão: se se separarem ou pressionarem, é sinal de distração ou tensão.',
    },
    erros: ['Polegares a pressionar', 'Mãos afastadas do abdómen', 'Ombros tensos'],
  },
  'bhairava-mudra': {
    partes: {
      maos: 'Mãos no colo, palmas para cima, a direita pousada sobre a esquerda (Bhairava); a esquerda sobre a direita é Bhairavi.',
      bracos: 'Relaxados.',
      atencao: 'Mudra de meditação e de pranayama lento; sem contacto dos polegares.',
    },
    erros: ['Dedos crispados', 'Mãos a escorregar para os joelhos'],
  },
  'prana-mudra': {
    partes: {
      maos: 'Pontas do anelar e do mindinho tocam a ponta do polegar; indicador e médio estendidos; palmas para cima, nos joelhos.',
      respiracao: 'Lenta e profunda; sentir vitalidade a subir com a inspiração.',
    },
    erros: ['Indicador e médio dobrados', 'Pressão forte'],
  },
  'apana-mudra': {
    partes: {
      maos: 'Pontas do médio e do anelar tocam a ponta do polegar; indicador e mindinho estendidos; palmas para cima, nos joelhos.',
      respiracao: 'Expiração longa; sentir o peso a descer para a bacia.',
    },
    erros: ['Confundir com Prana Mudra (dedos trocados)', 'Tensão nos dedos estendidos'],
  },
  'shambhavi-mudra': {
    partes: {
      cabeca: 'Neutra; só os olhos se movem, a cabeça não inclina para trás.',
      olhar: 'Olhos abertos, dirigidos para cima e para dentro, para o ponto entre as sobrancelhas, sem forçar; depois fechar os olhos mantendo a atenção nesse ponto.',
      respiracao: 'Lenta e natural.',
      atencao: 'Manter poucos segundos de cada vez ao início; parar se houver tensão ou dor nos olhos.',
    },
    erros: ['Esforço excessivo nos olhos', 'Cabeça para trás', 'Franzir a testa'],
  },
  'shanmukhi-mudra': {
    partes: {
      ombros: 'Relaxados; cotovelos à altura dos ombros.',
      maos: 'Polegares fecham as orelhas, indicadores pousam suavemente sobre as pálpebras, médios de cada lado das narinas, anelares acima do lábio superior e mindinhos abaixo do lábio inferior.',
      cabeca: 'Rosto completamente descontraído.',
      respiracao: 'Lenta; em Bhramari, expirar com zumbido.',
      atencao: 'Pressão mínima nos olhos; nunca pressionar os globos oculares.',
    },
    erros: ['Pressão nos olhos', 'Cotovelos a cair com ombros tensos', 'Reter a respiração'],
  },
  'khechari-mudra': {
    partes: {
      cabeca: 'Língua enrolada para trás, ponta a tocar o palato mole o mais atrás possível, sem esforço; boca fechada; maxilar solto.',
      respiracao: 'Lenta, pelo nariz; pode combinar-se com Ujjayi.',
      atencao: 'Forma simples (Nabho Mudra): basta a língua no palato; relaxar a língua quando cansar.',
    },
    erros: ['Forçar a língua com dor', 'Tensão no maxilar', 'Prender a respiração'],
  },
  'mula-bandha': {
    partes: {
      ancas: 'Sentado com a base estável, ísquios assentes.',
      coluna: 'Ereta.',
      respiracao: 'Inspirar; contrair suavemente o períneo (entre os genitais e o ânus) e elevá-lo; manter alguns segundos; soltar na expiração. Com prática, mantém-se durante a retenção.',
      atencao: 'A contração é subtil e interior, não dos glúteos nem do abdómen; o rosto mantém-se solto.',
    },
    erros: ['Contrair glúteos e coxas', 'Prender a respiração com tensão no rosto', 'Contração forte em vez de subtil'],
  },
  'uddiyana-bandha': {
    partes: {
      pes: 'Afastados à largura das ancas (versão de pé).',
      joelhos: 'Ligeiramente fletidos.',
      maos: 'Pousadas nas coxas, braços estendidos a suportar o tronco.',
      coluna: 'Tronco inclinado à frente, costas longas.',
      cabeca: 'Queixo ligeiramente recolhido.',
      respiracao: 'Expirar completamente; sem inspirar, simular uma inspiração (expandir as costelas) para o abdómen ser sugado para dentro e para cima, sob as costelas. Manter enquanto for confortável; soltar o abdómen antes de inspirar.',
      atencao: 'Só com estômago e intestinos vazios; nunca na gravidez nem com hipertensão.',
    },
    erros: ['Contrair o abdómen em vez de o sugar com a falsa inspiração', 'Inspirar antes de soltar', 'Fazer depois de comer'],
  },
  'jalandhara-bandha': {
    partes: {
      coluna: 'Ereta, peito elevado.',
      peito: 'Esterno sobe ao encontro do queixo.',
      ombros: 'Relaxados, ligeiramente para trás.',
      maos: 'Nos joelhos, braços estendidos (na versão clássica, pressionar os joelhos).',
      cabeca: 'Queixo desce para a cavidade entre as clavículas; a nuca alonga; não forçar a flexão do pescoço.',
      respiracao: 'Aplicar na retenção com pulmões cheios; levantar a cabeça antes de expirar.',
    },
    erros: ['Forçar o queixo para baixo com o peito a cair', 'Pescoço comprimido', 'Expirar com o queixo ainda em baixo'],
  },

  // ======================= AQUECIMENTO =====================================
  'rotacoes-pescoco': {
    partes: {
      coluna: 'Ereta, tronco imóvel; só a cabeça se move.',
      ombros: 'Descem e ficam relaxados durante todo o movimento.',
      cabeca: 'Movimentos lentos: queixo ao peito, orelha ao ombro, rotação suave; evitar levar a cabeça atrás com força.',
      olhar: 'Olhos fechados ou suaves.',
      respiracao: 'Lenta; expirar ao descer, inspirar ao voltar ao centro.',
      atencao: 'Semicírculos à frente são mais seguros do que círculos completos.',
    },
    erros: ['Movimentos rápidos', 'Ombros a subir', 'Hiperextensão do pescoço'],
  },
  'rotacoes-ombros': {
    partes: {
      pes: 'À largura das ancas (ou sentado).',
      coluna: 'Ereta e imóvel.',
      ombros: 'Círculos amplos e lentos: para a frente, para cima, para trás e para baixo; nos dois sentidos.',
      maos: 'Pontas dos dedos nos ombros (cotovelos desenham os círculos) ou braços soltos.',
      respiracao: 'Inspirar ao elevar, expirar ao descer.',
    },
    erros: ['Pescoço tenso', 'Círculos pequenos e rápidos', 'Tronco a oscilar'],
  },
  'circulos-ancas': {
    partes: {
      pes: 'À largura das ancas, paralelos, assentes.',
      joelhos: 'Soltos, ligeiramente fletidos.',
      ancas: 'Círculos amplos e lentos nos dois sentidos; o movimento nasce na bacia.',
      coluna: 'Alto do tronco relativamente estável.',
      maos: 'Nas ancas.',
      respiracao: 'Natural e contínua.',
    },
    erros: ['Mover só os joelhos', 'Peso a sair dos pés', 'Reter a respiração'],
  },
  'rotacoes-tornozelos': {
    partes: {
      pes: 'Círculos lentos com o pé, nos dois sentidos; também flexão e extensão e dedos a abrir e fechar.',
      pernas: 'Estendidas, sentado, ou uma perna cruzada sobre a outra.',
      coluna: 'Ereta.',
      maos: 'Para os pulsos: dedos entrelaçados, círculos nos dois sentidos; depois abrir e fechar as mãos.',
      respiracao: 'Natural.',
    },
    erros: ['Movimentos rápidos e pequenos', 'Tronco a arredondar'],
  },

  // ======================= SAUDAÇÃO AO SOL =================================
  'surya-namaskar': {
    partes: {
      pes: 'Começar e terminar em Tadasana, pés juntos ou à largura das ancas, bem assentes.',
      joelhos: 'Nos lunges, joelho da frente sobre o tornozelo; nas flexões, joelhos fletidos se necessário.',
      coluna: 'Alongar antes de cada flexão e de cada extensão; proteger a lombar com o abdómen ativo.',
      ombros: 'Afastados das orelhas nas posturas de apoio (prancha, cobra, cão).',
      maos: 'Dedos abertos e a pressionar o chão em todas as posições de apoio.',
      respiracao: 'Um movimento por respiração: inspirar ao abrir e estender, expirar ao fechar e fletir.',
      atencao: 'Ritmo que permita respirar; trocar a perna que avança entre rondas.',
    },
    erros: ['Acelerar e perder a respiração', 'Saltar etapas da sequência', 'Alternar sempre o mesmo lado'],
  },

  // ======================= RELAXAMENTO E MEDITAÇÃO =========================
  'yoga-nidra': {
    partes: {
      pes: 'Afastados à largura do tapete, a cair para fora.',
      pernas: 'Soltas; almofada sob os joelhos se a lombar pedir.',
      coluna: 'Longa no chão (Savasana), simétrica.',
      bracos: 'Afastados do tronco, palmas para cima.',
      cabeca: 'Centrada; manta fina por baixo; olhos fechados.',
      respiracao: 'Natural; não controlar.',
      atencao: 'Corpo coberto e imóvel durante toda a prática; manter-se acordado e consciente; sankalpa no início e no fim.',
    },
    erros: ['Mexer-se durante a prática', 'Frio (sem manta)', 'Adormecer'],
  },
  'meditacao-respiracao': {
    partes: {
      pes: 'Em postura sentada estável (Sukhasana, Siddhasana, Padmasana ou cadeira).',
      ancas: 'Sobre almofada se necessário, para a bacia ficar neutra.',
      coluna: 'Ereta e estável, sem rigidez; crescer a partir da coroa.',
      ombros: 'Relaxados.',
      maos: 'No colo em Dhyana Mudra ou nos joelhos em Chin Mudra.',
      cabeca: 'Queixo ligeiramente recolhido, rosto e língua soltos.',
      olhar: 'Olhos fechados ou semicerrados para um ponto baixo.',
      respiracao: 'Observar o ar nas narinas ou o movimento do abdómen, sem controlar; voltar suavemente sempre que a mente se afastar.',
      atencao: 'Imobilidade confortável; reajustar a postura só se for necessário.',
    },
    erros: ['Costas arredondadas e sono', 'Rigidez e tensão nos ombros', 'Lutar contra os pensamentos'],
  },
  encerramento: {
    partes: {
      coluna: 'Ereta e relaxada.',
      maos: 'Em prece ao peito (Anjali Mudra), polegares no esterno.',
      cabeca: 'Ligeiramente inclinada em gratidão.',
      olhar: 'Olhos fechados.',
      respiracao: 'Três respirações profundas; OM opcional.',
      atencao: 'Recordar a intenção da aula; sair devagar do tapete.',
    },
    erros: ['Terminar à pressa', 'Esquecer a transição para o dia'],
  },
}
