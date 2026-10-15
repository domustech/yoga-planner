import type { ChakraId, Efeito } from './types'

// ---------------------------------------------------------------------------
// Conhecimento de apoio ao instrutor: caminhos do Yoga, Yoga Sutras de
// Patanjali, Vedanta (na linha de Swami Dayananda Saraswati), roteiros de
// meditação e glossário. Serve para preparar meditações e conversas com alunos.
// ---------------------------------------------------------------------------

export interface Caminho {
  nome: string
  sanscrito: string
  descricao: string
  naAula: string
}

/** Os caminhos (margas) clássicos do Yoga. */
export const CAMINHOS: Caminho[] = [
  {
    nome: 'Hatha Yoga',
    sanscrito: 'Haṭha Yoga',
    descricao:
      'O yoga do corpo e da energia: asanas, pranayama, mudras, bandhas e kriyas (purificações). "Ha" (sol) e "tha" (lua) apontam para o equilíbrio das polaridades; "hatha" significa também força, disciplina. Texto de referência: Hatha Yoga Pradipika (séc. XV), que apresenta o Hatha como escada para o Raja Yoga.',
    naAula: 'É a base da nossa prática: preparar o corpo e a respiração para a quietude.',
  },
  {
    nome: 'Raja Yoga',
    sanscrito: 'Rāja Yoga',
    descricao:
      'O "yoga real", da mente: o caminho dos oito membros (ashtanga) sistematizado por Patanjali nos Yoga Sutras. Vai da ética (yama, niyama) à postura, respiração, recolhimento, concentração, meditação e absorção (samadhi).',
    naAula: 'Cada aula percorre em miniatura os oito membros: da intenção ética ao silêncio final.',
  },
  {
    nome: 'Karma Yoga',
    sanscrito: 'Karma Yoga',
    descricao:
      'O yoga da ação: agir com atenção e sem apego ao resultado, oferecendo a ação (ishvara arpana buddhi) e aceitando o resultado com serenidade (prasada buddhi). Ensinado por Krishna no Bhagavad Gita.',
    naAula: 'Praticar sem comparar nem competir; a postura é uma oferta, não uma conquista.',
  },
  {
    nome: 'Bhakti Yoga',
    sanscrito: 'Bhakti Yoga',
    descricao: 'O yoga da devoção: entrega, gratidão, mantras, cânticos (kirtan), reverência ao que é maior do que o ego.',
    naAula: 'Namaste, o OM, a gratidão no encerramento, a entrega no Savasana.',
  },
  {
    nome: 'Jnana Yoga',
    sanscrito: 'Jñāna Yoga',
    descricao:
      'O yoga do conhecimento: a investigação sobre a natureza do eu ("quem sou eu?") através do estudo (Vedanta, Upanishads), da reflexão e da contemplação.',
    naAula: 'As perguntas simples no fim da aula: quem observa a respiração? Quem está calmo?',
  },
  {
    nome: 'Kundalini / Tantra Yoga',
    sanscrito: 'Kuṇḍalinī Yoga',
    descricao:
      'Trabalha a energia subtil: chakras, nadis, bandhas, mudras e mantras para despertar a energia adormecida na base da coluna (kundalini) e elevá-la pela sushumna.',
    naAula: 'A leitura energética das posturas (efeitos subtis, chakras) vem desta tradição.',
  },
  {
    nome: 'Mantra / Nada Yoga',
    sanscrito: 'Mantra Yoga · Nāda Yoga',
    descricao: 'O yoga do som: repetição de mantras (japa), OM, mantras-semente dos chakras e escuta do som interior (nada).',
    naAula: 'OM inicial e final, Bhramari, Shanmukhi Mudra.',
  },
]

export interface Membro {
  n: number
  nome: string
  sanscrito: string
  traducao: string
  descricao: string
  naAula: string
}

/** Os oito membros (ashtanga) do Raja Yoga de Patanjali (YS II.29). */
export const OITO_MEMBROS: Membro[] = [
  {
    n: 1,
    nome: 'Yama',
    sanscrito: 'Yama',
    traducao: 'Disciplinas éticas (relação com os outros)',
    descricao:
      'Ahimsa (não-violência), Satya (verdade), Asteya (não roubar), Brahmacharya (moderação, contenção) e Aparigraha (não acumular, não agarrar).',
    naAula: 'Ahimsa no próprio corpo: nunca forçar. Satya: honestidade com os limites de hoje. Aparigraha: largar a postura sem agarrar o resultado.',
  },
  {
    n: 2,
    nome: 'Niyama',
    sanscrito: 'Niyama',
    traducao: 'Disciplinas pessoais',
    descricao:
      'Saucha (pureza), Santosha (contentamento), Tapas (disciplina, ardor), Svadhyaya (estudo de si e dos textos) e Ishvara Pranidhana (entrega ao Senhor, à ordem maior).',
    naAula: 'Santosha: aceitar o corpo de hoje. Tapas: mais uma respiração na postura. Ishvara Pranidhana: a entrega no Savasana.',
  },
  {
    n: 3,
    nome: 'Asana',
    sanscrito: 'Āsana',
    traducao: 'Postura',
    descricao: '"Sthira sukham asanam" (II.46): a postura é firme e confortável. Alcança-se pelo relaxamento do esforço e pela absorção no infinito (II.47).',
    naAula: 'Em cada postura procurar os dois: firmeza (sthira) e conforto (sukha). Se falta um, ajustar.',
  },
  {
    n: 4,
    nome: 'Pranayama',
    sanscrito: 'Prāṇāyāma',
    traducao: 'Regulação da respiração / energia',
    descricao: 'Estabelecida a postura, a regulação do fluxo da inspiração, da expiração e das retenções (II.49–II.53). Remove o véu sobre a luz interior e prepara a mente para a concentração.',
    naAula: 'Nadi Shodhana, Ujjayi, Bhramari: escolher o pranayama pelo efeito desejado (calmante, energizante, equilibrante).',
  },
  {
    n: 5,
    nome: 'Pratyahara',
    sanscrito: 'Pratyāhāra',
    traducao: 'Recolhimento dos sentidos',
    descricao: 'Os sentidos deixam de seguir os objetos exteriores e voltam-se para dentro (II.54). É a ponte entre a prática exterior e a interior.',
    naAula: 'Olhos fechados, Shanmukhi Mudra, Yoga Nidra, o silêncio antes da meditação.',
  },
  {
    n: 6,
    nome: 'Dharana',
    sanscrito: 'Dhāraṇā',
    traducao: 'Concentração',
    descricao: 'Fixar a mente num só ponto ou objeto (III.1): a respiração, um mantra, a chama de uma vela, um chakra.',
    naAula: 'Contar respirações, Trataka, repetir So-Ham.',
  },
  {
    n: 7,
    nome: 'Dhyana',
    sanscrito: 'Dhyāna',
    traducao: 'Meditação',
    descricao: 'Fluxo contínuo e sem esforço da atenção sobre o objeto (III.2). A concentração torna-se natural.',
    naAula: 'Quando o esforço de concentrar desaparece e resta só a observação.',
  },
  {
    n: 8,
    nome: 'Samadhi',
    sanscrito: 'Samādhi',
    traducao: 'Absorção, integração',
    descricao: 'O objeto brilha por si, como se a mente estivesse vazia da sua própria forma (III.3). União, plenitude, liberdade (kaivalya).',
    naAula: 'Não se "faz"; prepara-se. Momentos de silêncio total no fim da aula são o seu sabor.',
  },
]

export interface Sutra {
  ref: string
  texto: string
  traducao: string
  comentario: string
}

/** Sutras essenciais dos Yoga Sutras de Patanjali (transliteração simplificada). */
export const SUTRAS: Sutra[] = [
  { ref: 'I.1', texto: 'atha yogānuśāsanam', traducao: 'Agora, a exposição do Yoga.', comentario: '"Atha" (agora) marca a prontidão do aluno. Cada aula começa no agora, com o que há.' },
  { ref: 'I.2', texto: 'yogaś citta-vṛtti-nirodhaḥ', traducao: 'Yoga é a cessação das flutuações da mente.', comentario: 'A definição central. Tudo o que fazemos (asana, pranayama) serve para acalmar as ondas da mente (vritti).' },
  { ref: 'I.3', texto: 'tadā draṣṭuḥ svarūpe avasthānam', traducao: 'Então, aquele que vê repousa na sua própria natureza.', comentario: 'Quando a mente aquieta, o observador reconhece-se. Ligação direta ao Vedanta (sakshi, a testemunha).' },
  { ref: 'I.12', texto: 'abhyāsa-vairāgyābhyāṁ tan-nirodhaḥ', traducao: 'Essas flutuações acalmam-se pela prática e pelo desapego.', comentario: 'As duas asas: abhyasa (esforço constante) e vairagya (largar). Uma sem a outra desequilibra.' },
  { ref: 'I.14', texto: 'sa tu dīrgha-kāla-nairantarya-satkārāsevito dṛḍha-bhūmiḥ', traducao: 'A prática firma-se quando cultivada durante muito tempo, sem interrupção e com dedicação.', comentario: 'Três condições para a prática dar fruto. Bom para motivar alunos: regularidade vale mais do que intensidade.' },
  { ref: 'I.23', texto: 'īśvara-praṇidhānād vā', traducao: 'Ou pela entrega a Ishvara.', comentario: 'A via da entrega: confiar numa ordem maior. Não exige crença religiosa; é a atitude de largar o controlo.' },
  { ref: 'I.24', texto: 'kleśa-karma-vipākāśayair aparāmṛṣṭaḥ puruṣa-viśeṣa īśvaraḥ', traducao: 'Ishvara é um Ser especial, intocado pelas aflições, pelas ações, pelos seus frutos e pelas impressões.', comentario: 'Ishvara em Patanjali: a consciência livre, o modelo de liberdade. No Vedanta, Ishvara é a totalidade e a sua ordem.' },
  { ref: 'I.27', texto: 'tasya vācakaḥ praṇavaḥ', traducao: 'A palavra que O exprime é o OM (pranava).', comentario: 'Porquê cantar OM: é o som que aponta para o todo. I.28 acrescenta: repeti-lo e meditar no seu significado.' },
  { ref: 'I.33', texto: 'maitrī-karuṇā-muditopekṣāṇāṁ sukha-duḥkha-puṇyāpuṇya-viṣayāṇāṁ bhāvanātaś citta-prasādanam', traducao: 'A mente serena-se cultivando amizade para com os felizes, compaixão para com os que sofrem, alegria com os virtuosos e equanimidade perante os não-virtuosos.', comentario: 'As quatro atitudes (brahmaviharas). Excelente base para a meditação do coração (anahata).' },
  { ref: 'I.34', texto: 'pracchardana-vidhāraṇābhyāṁ vā prāṇasya', traducao: 'Ou pela expulsão e retenção do sopro.', comentario: 'Patanjali aponta o pranayama como meio direto de serenar a mente.' },
  { ref: 'II.1', texto: 'tapaḥ-svādhyāyeśvara-praṇidhānāni kriyā-yogaḥ', traducao: 'Disciplina, estudo de si e entrega a Ishvara constituem o Yoga da ação (Kriya Yoga).', comentario: 'Os três niyamas que resumem a prática: esforço, autoconhecimento e entrega.' },
  { ref: 'II.3', texto: 'avidyāsmitā-rāga-dveṣābhiniveśāḥ kleśāḥ', traducao: 'As aflições (kleshas) são: ignorância, sentido de ego, apego, aversão e medo da morte (apego à vida).', comentario: 'A raiz é avidya (não ver com clareza). O yoga reduz as aflições; o conhecimento (Vedanta) dissolve a raiz.' },
  { ref: 'II.29', texto: 'yama-niyamāsana-prāṇāyāma-pratyāhāra-dhāraṇā-dhyāna-samādhayo aṣṭāv aṅgāni', traducao: 'Os oito membros são: yama, niyama, asana, pranayama, pratyahara, dharana, dhyana e samadhi.', comentario: 'O mapa do caminho. Ver "Os oito membros".' },
  { ref: 'II.33', texto: 'vitarka-bādhane pratipakṣa-bhāvanam', traducao: 'Quando pensamentos perturbadores surgem, cultivar o oposto.', comentario: 'Pratipaksha bhavana: ferramenta prática para a vida e para a meditação (substituir a irritação pela paciência, o medo pela confiança).' },
  { ref: 'II.46', texto: 'sthira-sukham āsanam', traducao: 'A postura é firme e confortável.', comentario: 'A única definição de asana nos Sutras. Firmeza sem rigidez, conforto sem moleza.' },
  { ref: 'II.47', texto: 'prayatna-śaithilyānanta-samāpattibhyām', traducao: 'Pelo relaxamento do esforço e pela absorção no infinito.', comentario: 'Como chegar a II.46: soltar o esforço desnecessário e abrir a atenção ao ilimitado (Ananta, a serpente que sustenta o mundo).' },
  { ref: 'II.48', texto: 'tato dvandvānabhighātaḥ', traducao: 'Então, deixa-se de ser afetado pelos pares de opostos.', comentario: 'Fruto da asana: calor e frio, prazer e dor, elogio e crítica deixam de perturbar.' },
  { ref: 'II.49', texto: 'tasmin sati śvāsa-praśvāsayor gati-vicchedaḥ prāṇāyāmaḥ', traducao: 'Estando isso estabelecido, pranayama é a regulação do fluxo da inspiração e da expiração.', comentario: 'O pranayama vem depois da asana: só um corpo estável respira com liberdade.' },
  { ref: 'II.54', texto: 'sva-viṣayāsamprayoge cittasya svarūpānukāra ivendriyāṇāṁ pratyāhāraḥ', traducao: 'Pratyahara é o recolhimento dos sentidos, que deixam de se ligar aos seus objetos e como que seguem a natureza da mente.', comentario: 'Os sentidos voltam-se para dentro. Antecâmara da meditação.' },
  { ref: 'III.1–3', texto: 'deśa-bandhaś cittasya dhāraṇā · tatra pratyayaikatānatā dhyānam · tad evārtha-mātra-nirbhāsaṁ svarūpa-śūnyam iva samādhiḥ', traducao: 'Concentração é fixar a mente num ponto; meditação é o fluxo contínuo da atenção nesse ponto; samadhi é quando só o objeto brilha, como se a mente estivesse vazia de si.', comentario: 'Os três membros interiores (samyama) são graus de uma mesma atenção.' },
]

export interface Ensinamento {
  titulo: string
  resumo: string
  pontos: string[]
  naAula?: string
}

/**
 * Vedanta básico (Advaita), na linha de ensino de Swami Dayananda Saraswati
 * (Arsha Vidya): o Vedanta como meio de conhecimento (pramana) sobre a natureza
 * do eu, e não como crença. Linguagem simples para usar com alunos.
 */
export const VEDANTA: Ensinamento[] = [
  {
    titulo: 'O que é o Vedanta',
    resumo: 'Vedanta ("o fim dos Vedas") é o ensinamento das Upanishads, do Bhagavad Gita e dos Brahma Sutras sobre a natureza do eu (atma) e da realidade (Brahman).',
    pontos: [
      'Não é um sistema de crenças mas um meio de conhecimento (pramana), como os olhos são o meio para ver cores: revela algo que já é verdade sobre nós.',
      'O método tradicional tem três passos: shravana (ouvir o ensinamento), manana (resolver as dúvidas pela reflexão) e nididhyasana (contemplar até assimilar).',
      'Swami Dayananda Saraswati (1930–2015), fundador da Arsha Vidya Gurukulam, insistia em que o Vedanta se ensina com uma metodologia e numa relação professor–aluno, com clareza e sem mistificação.',
    ],
    naAula: 'Não precisamos de acreditar em nada: só de observar com atenção quem está a respirar.',
  },
  {
    titulo: 'O problema humano fundamental',
    resumo: 'Toda a gente procura ser adequada, completa, feliz; e procura isso em objetos, pessoas e situações que mudam.',
    pontos: [
      'Sentimo-nos pequenos, limitados, insuficientes ("eu não sou suficiente") e tentamos resolver isso acrescentando coisas: ter, fazer, ser alguém.',
      'O Vedanta diz que o problema está mal diagnosticado: não é falta de coisas, é um erro sobre quem somos (avidya, não ver). Um erro de conhecimento só se resolve com conhecimento, não com mais ação.',
      'A promessa do ensinamento: o eu já é pleno (purna). A busca termina quando se reconhece aquilo que se procurava.',
    ],
    naAula: 'A prática não vai tornar-nos melhores: vai ajudar-nos a ver o que já está bem.',
  },
  {
    titulo: 'Atma e anatma: quem observa',
    resumo: 'Distinguir o que vê (a consciência, sakshi, a testemunha) do que é visto (corpo, respiração, sensações, emoções, pensamentos).',
    pontos: [
      'Tudo o que posso observar não sou eu, no sentido de que muda e eu permaneço: observo o corpo, a respiração, a mente. O que observa não é observado.',
      'Três corpos: grosseiro (físico), subtil (prana, mente, intelecto) e causal (o estado de sono profundo, a semente). Cinco invólucros (koshas): alimento, energia, mente, intelecto, alegria. O eu não é nenhum deles, mas ilumina todos.',
      '"Eu não sou o corpo, mas o corpo não é separado de mim": a consciência é a base de tudo o que aparece, como o ecrã é a base do filme.',
    ],
    naAula: 'Em Savasana: observar o corpo pesado, a respiração que acontece sozinha, os pensamentos que passam. Quem observa isto tudo?',
  },
  {
    titulo: 'Os três estados (avasthatraya)',
    resumo: 'Vigília, sonho e sono profundo: os três estados vêm e vão; a consciência que os conhece está presente nos três.',
    pontos: [
      'Na vigília há um mundo e um corpo; no sonho outro mundo e outro corpo; no sono profundo não há nada, e ainda assim "eu dormi bem", alguém estava lá.',
      'O eu não é nenhum dos estados; é aquilo que os ilumina. Isto mostra que a nossa identidade não depende do corpo nem da mente.',
      'Mandukya Upanishad: OM com os três sons (A-U-M) representa os três estados, e o silêncio que se segue, o quarto (turiya), a consciência pura.',
    ],
    naAula: 'Ao cantar OM: A (vigília), U (sonho), M (sono profundo), e o silêncio depois: o que fica quando tudo pára.',
  },
  {
    titulo: 'Sat-chit-ananda: a natureza do eu',
    resumo: 'O eu é existência (sat), consciência (chit) e plenitude (ananda), não como três coisas mas como uma só realidade.',
    pontos: [
      'Sat: eu sou; nunca duvido da minha existência. Chit: eu sei que sou; a consciência é evidente por si. Ananda: a plenitude que se revela quando a mente aquieta (por isso a alegria após uma boa prática não vem de fora).',
      'A alegria que sentimos com objetos é a nossa própria plenitude refletida numa mente momentaneamente tranquila.',
      'Mahavakyas (grandes frases): "Tat tvam asi" (Tu és Isso), "Aham Brahmasmi" (Eu sou Brahman), "Prajnanam Brahma" (A consciência é Brahman), "Ayam atma Brahma" (Este eu é Brahman).',
    ],
    naAula: 'A calma do fim da aula não foi fabricada; foi descoberta. Já cá estava.',
  },
  {
    titulo: 'Ishvara: a totalidade e a sua ordem',
    resumo: 'No ensinamento de Swami Dayananda, Ishvara não é uma pessoa algures no céu: é o todo, manifesto como ordem (física, biológica, psicológica, ética e de causa–efeito).',
    pontos: [
      'Tudo o que acontece acontece dentro de uma ordem; nada está fora dela. Reconhecer isto reduz a ansiedade de controlo.',
      'Ishvara pranidhana (entrega) torna-se então razoável: faço o que posso e aceito o resultado como vindo da ordem (prasada buddhi), não como vitória ou derrota pessoal.',
      'A oração e o ritual são ações com valor próprio: exprimem reconhecimento e humildade. A gratidão é a forma mais simples.',
    ],
    naAula: 'Há coisas que dependem de mim (a atenção, o esforço) e coisas que não (o resultado, o corpo de hoje). Entregar o segundo, cuidar do primeiro.',
  },
  {
    titulo: 'Karma Yoga: a atitude na ação',
    resumo: 'Agir com dedicação, oferecendo a ação (ishvara arpana buddhi) e recebendo o resultado com serenidade (prasada buddhi). Bhagavad Gita II.47: tens direito à ação, não aos seus frutos.',
    pontos: [
      'Não é indiferença: é fazer o melhor sem exigir que o mundo obedeça. O resultado vem da ordem, com muitas variáveis além da minha.',
      'O Karma Yoga prepara a mente (antahkarana shuddhi): uma mente menos agitada por sucessos e fracassos está pronta para o conhecimento.',
      'Dharma: agir de acordo com os valores universais (não magoar, não enganar) e com o papel que me cabe; a liberdade interior começa aí.',
    ],
    naAula: 'A postura que não sai hoje é informação, não fracasso. Oferece-se o esforço, recebe-se o resultado.',
  },
  {
    titulo: 'O valor dos valores',
    resumo: 'Swami Dayananda ensinava (em "The Value of Values") que os valores só se tornam nossos quando compreendemos o seu valor para nós, não por imposição.',
    pontos: [
      'Bhagavad Gita XIII.7–11 lista as qualidades do conhecimento: ausência de orgulho e de hipocrisia, não-violência, paciência (kshanti), retidão (arjavam), serviço ao professor, pureza, firmeza, domínio de si, desapego, ausência de ego, equanimidade, devoção e gosto pela solidão.',
      'Um valor meio assimilado gera conflito: sei que não devo, mas quero. O trabalho é ver claramente o custo de ir contra o valor, até o valor se tornar natural.',
      'Os yamas e niyamas de Patanjali são a mesma lista vista do lado da prática.',
    ],
    naAula: 'Ahimsa começa connosco: a maneira como falamos ao nosso corpo quando ele não faz o que queremos.',
  },
  {
    titulo: 'A mente como instrumento',
    resumo: 'A mente não é o problema; é um instrumento. O problema é tomar a mente, com os seus humores, como sendo "eu".',
    pontos: [
      'Objetividade: ver as coisas como são, incluindo as próprias emoções, sem as negar nem as inflacionar. Uma emoção observada já não me governa totalmente.',
      'Lidar com a raiva ou o medo: reconhecer, dar espaço, perceber a expectativa frustrada por trás; depois escolher a resposta. Pratipaksha bhavana (YS II.33) ajuda.',
      'A meditação em Vedanta não é para produzir um estado mas para assimilar o que se compreendeu: "eu sou a consciência que observa esta mente".',
    ],
    naAula: 'Quando surgir um pensamento durante a meditação, não lutar: notar "pensamento", e voltar. O que notou o pensamento não é o pensamento.',
  },
  {
    titulo: 'As quatro buscas humanas (purusharthas)',
    resumo: 'Artha (segurança, meios), Kama (prazer, bem-estar), Dharma (retidão, contribuir) e Moksha (liberdade interior). As três primeiras ganham sentido quando orientadas pela quarta.',
    pontos: [
      'Toda a gente procura segurança e prazer; a maturidade aparece quando se descobre que nenhum deles resolve a sensação de limitação.',
      'Moksha não é um lugar depois da morte: é a liberdade, aqui, de não depender de nada para me sentir inteiro.',
      'O yoga serve as quatro buscas: saúde (artha), bem-estar (kama), conduta (dharma) e, sobretudo, preparação da mente para a liberdade (moksha).',
    ],
    naAula: 'Porque é que viemos à aula? Saúde, calma... e, por baixo disso, o desejo de estar em paz connosco.',
  },
]

export interface Meditacao {
  id: string
  nome: string
  duracao: string
  efeito: Efeito
  chakras?: ChakraId[]
  objetivo: string
  /** Passos do roteiro, para ler ou adaptar em voz alta. */
  roteiro: string[]
  fonte?: string
}

/** Roteiros de meditação para guiar em aula. */
export const MEDITACOES: Meditacao[] = [
  {
    id: 'observacao-respiracao',
    nome: 'Observação da respiração',
    duracao: '5–10 min',
    efeito: 'calmante',
    chakras: ['ajna', 'anahata'],
    objetivo: 'Dharana simples; serve de base a todas as outras.',
    roteiro: [
      'Sentar com a coluna longa, mãos em Jnana ou Chin Mudra. Fechar os olhos.',
      'Sentir os pontos de apoio: ísquios, pernas, mãos. Deixar o corpo assentar.',
      'Levar a atenção à respiração natural, sem a mudar. Notar onde se sente melhor: narinas, peito ou abdómen.',
      'Acompanhar cada inspiração do princípio ao fim; cada expiração do princípio ao fim. Notar a pequena pausa entre as duas.',
      'Quando a mente se afastar, e vai afastar-se, notar sem julgar e voltar à respiração seguinte.',
      'Opcional: contar as expirações de 1 a 10 e recomeçar.',
      'Nos últimos instantes, largar a contagem; ficar só com a sensação de estar presente. Abrir os olhos devagar.',
    ],
  },
  {
    id: 'so-ham',
    nome: 'So-Ham (o mantra natural da respiração)',
    duracao: '10 min',
    efeito: 'equilibrante',
    chakras: ['anahata', 'ajna'],
    objetivo: 'Ajapa japa: o mantra que a respiração já repete. "So" (Isso) na inspiração, "Ham" (eu) na expiração: "Eu sou Isso".',
    roteiro: [
      'Postura de meditação estável; alguns ciclos de respiração completa.',
      'Ouvir o som subtil da inspiração como "Sooo" e o da expiração como "Hammm".',
      'Deixar o mantra acompanhar a respiração sem esforço; não forçar o ritmo.',
      'Sentir a respiração a entrar e a sair ao longo de um canal entre o umbigo e a garganta (opcional, Satyananda).',
      'Se a mente dispersar, voltar ao som. Com o tempo o mantra repete-se sozinho.',
      'Terminar deixando o mantra dissolver-se no silêncio; observar a quietude.',
    ],
  },
  {
    id: 'meditacao-coracao',
    nome: 'Meditação do coração (Anahata)',
    duracao: '10–15 min',
    efeito: 'calmante',
    chakras: ['anahata'],
    objetivo: 'Cultivar as quatro atitudes de Yoga Sutra I.33: amizade, compaixão, alegria e equanimidade. Para uma prática virada para a calma e para o chakra do coração.',
    roteiro: [
      'Sentar; mãos em Hridaya ou Padma Mudra, ou uma mão sobre o peito.',
      'Respirar para o centro do peito: sentir o espaço atrás do esterno a expandir na inspiração e a amolecer na expiração.',
      'Visualizar uma luz verde ou dourada no coração, ou simplesmente uma sensação de calor.',
      'Trazer alguém de quem se gosta; dizer em silêncio: "Que estejas bem. Que estejas em paz." Sentir o que acontece no peito.',
      'Dirigir as mesmas frases a si próprio: "Que eu esteja bem. Que eu esteja em paz."',
      'Alargar a uma pessoa neutra, depois a alguém difícil (só se for confortável), depois a todos os seres.',
      'Opcional: mantra YAM, 9 a 27 repetições, sentido a vibrar no peito.',
      'Descansar na sensação do coração aberto; terminar com três respirações profundas e gratidão.',
    ],
  },
  {
    id: 'testemunha',
    nome: 'A testemunha (Sakshi Bhava)',
    duracao: '10 min',
    efeito: 'calmante',
    chakras: ['ajna', 'sahasrara'],
    objetivo: 'Contemplação Vedanta: reconhecer-se como a consciência que observa corpo, respiração e mente.',
    roteiro: [
      'Sentar em silêncio. Deixar os olhos fechar.',
      'Notar o corpo: peso, temperatura, contacto com o chão. "Eu observo o corpo; o corpo é observado."',
      'Notar a respiração a acontecer por si. "Eu observo a respiração."',
      'Notar sensações, emoções, estados de espírito. "Observo-os; vêm e vão."',
      'Notar os pensamentos a surgir e a desaparecer. "Observo os pensamentos. O que observa não é um pensamento."',
      'Perguntar suavemente: o que é que permanece quando tudo isto muda? Não responder com palavras; ficar com a evidência de estar consciente.',
      'Repousar nessa consciência simples, sem objeto. Se a mente se afastar, voltar a "eu observo".',
      'Terminar: "Tudo o que observei aparece em mim, a consciência. Eu sou plenitude (purna)." Abrir os olhos sem pressa.',
    ],
    fonte: 'Inspirado no método de ensino do Vedanta de Swami Dayananda Saraswati (drig-drishya viveka: a distinção entre o que vê e o que é visto).',
  },
  {
    id: 'rotacao-consciencia',
    nome: 'Rotação da consciência (Yoga Nidra curto)',
    duracao: '15 min',
    efeito: 'calmante',
    chakras: ['ajna', 'sahasrara'],
    objetivo: 'Relaxamento consciente profundo em Savasana; integra a prática.',
    roteiro: [
      'Deitar em Savasana, manta por cima. "Não dormir; ficar acordado e atento."',
      'Sankalpa: formular mentalmente uma intenção curta e positiva, 3 vezes.',
      'Rotação: levar a atenção, rapidamente e sem mexer, a cada parte do corpo: mão direita, polegar, dedos, palma, pulso, cotovelo, ombro... lado direito, lado esquerdo, costas, frente, cabeça.',
      'Sentir o corpo inteiro; o peso; depois a leveza.',
      'Respiração: contar de 27 para 1, uma contagem por expiração, sem se preocupar se perder a conta.',
      'Pares de opostos: calor e frio, peso e leveza (breve).',
      'Visualização simples: um céu limpo, uma vela, um lago quieto.',
      'Repetir o sankalpa 3 vezes. Voltar à respiração, aos sons da sala, ao corpo; mexer os dedos; virar para o lado; sentar.',
    ],
    fonte: 'Estrutura simplificada do Yoga Nidra de Swami Satyananda Saraswati.',
  },
  {
    id: 'om-ajapa',
    nome: 'Meditação no OM',
    duracao: '10 min',
    efeito: 'equilibrante',
    chakras: ['vishuddha', 'ajna', 'sahasrara'],
    objetivo: 'Mantra e sentido: Yoga Sutra I.27–28 (repetir o OM e contemplar o seu significado).',
    roteiro: [
      'Sentar; três OM cantados em voz alta, longos, sentindo a vibração do A no abdómen, do U no peito e do M na cabeça.',
      'Continuar o OM em voz baixa; depois só mentalmente, a cada expiração.',
      'Ouvir o silêncio depois do M: o quarto estado (turiya), a consciência que está em todos os sons.',
      'Deixar o OM tornar-se um fio subtil; se a mente dispersar, reforçar o som.',
      'Dissolver o mantra; repousar no silêncio uns momentos.',
    ],
  },
  {
    id: 'trataka',
    nome: 'Trataka (olhar fixo na chama)',
    duracao: '5–10 min',
    efeito: 'calmante',
    chakras: ['ajna'],
    objetivo: 'Concentração (dharana) e limpeza dos olhos; desperta ajna.',
    roteiro: [
      'Vela à altura dos olhos, a um braço de distância, sala em penumbra.',
      'Olhar fixamente para a chama sem pestanejar, 1 a 2 minutos, o corpo imóvel.',
      'Fechar os olhos e ver a imagem da chama no espaço interior, entre as sobrancelhas; mantê-la enquanto durar.',
      'Repetir 2 a 3 vezes. Terminar com os olhos fechados, atenção em ajna.',
      'Precauções: epilepsia, glaucoma e miopia forte; nunca forçar os olhos.',
    ],
  },
  {
    id: 'antar-mouna',
    nome: 'Antar Mouna (silêncio interior)',
    duracao: '10 min',
    efeito: 'calmante',
    chakras: ['ajna'],
    objetivo: 'Pratyahara e observação da mente: aceitar e deixar passar.',
    roteiro: [
      'Sentar; olhos fechados. Primeiro, ouvir todos os sons exteriores sem os nomear nem rejeitar.',
      'Depois, observar os pensamentos que surgem espontaneamente, como nuvens; não os seguir nem os afastar.',
      'Quando um pensamento insistir, criá-lo deliberadamente, olhá-lo e deixá-lo ir.',
      'Voltar à observação livre; notar os espaços entre pensamentos.',
      'Terminar na respiração e no corpo.',
    ],
    fonte: 'Técnica da tradição de Satyananda (Bihar School of Yoga).',
  },
  {
    id: 'purnam',
    nome: 'Contemplação da plenitude (Purnam)',
    duracao: '5 min',
    efeito: 'calmante',
    chakras: ['anahata', 'sahasrara'],
    objetivo: 'Encerramento no espírito do Vedanta: nada falta.',
    roteiro: [
      'Sentar em silêncio depois do Savasana.',
      'Recordar o mantra de paz das Upanishads: "Purnamadah purnamidam... Aquilo é pleno, isto é pleno; do pleno vem o pleno; tirando o pleno do pleno, o pleno permanece."',
      'Sentir o corpo em repouso, a mente tranquila: notar que, neste momento, nada falta.',
      'Reconhecer que essa sensação de inteireza não veio de fora: é a nossa natureza, revelada quando a mente aquieta.',
      'OM três vezes; Shanti, shanti, shanti. Namaste.',
    ],
  },
]

export interface Termo {
  termo: string
  significado: string
}

/** Glossário de termos do Yoga e do Vedanta. */
export const GLOSSARIO: Termo[] = [
  { termo: 'Yoga', significado: 'União; também "método". Da raiz yuj, unir ou atrelar. Patanjali: a cessação das flutuações da mente (I.2).' },
  { termo: 'Asana', significado: 'Postura; literalmente "assento". Firme e confortável (YS II.46).' },
  { termo: 'Pranayama', significado: 'Regulação (ayama: extensão, controlo) do prana através da respiração.' },
  { termo: 'Prana', significado: 'Energia vital; o sopro. Cinco vayus: prana (entrada, peito), apana (eliminação, bacia), samana (digestão, umbigo), udana (subida, garganta), vyana (circulação, todo o corpo).' },
  { termo: 'Nadi', significado: 'Canal subtil por onde circula o prana. Ida (lunar, esquerda), pingala (solar, direita) e sushumna (central).' },
  { termo: 'Chakra', significado: 'Roda; centro energético ao longo da sushumna. Sete principais, de muladhara a sahasrara.' },
  { termo: 'Kundalini', significado: 'Energia "enrolada" na base da coluna; o Hatha e o Tantra procuram despertá-la e conduzi-la pela sushumna.' },
  { termo: 'Bandha', significado: 'Fecho energético: Mula (raiz), Uddiyana (abdómen), Jalandhara (garganta); os três juntos: Maha Bandha.' },
  { termo: 'Mudra', significado: 'Selo, gesto. Gestos das mãos (hasta mudras), da cabeça (mana mudras), posturais, perineais; dirigem o prana.' },
  { termo: 'Mantra', significado: 'Som ou frase que protege a mente (man: mente, tra: proteger). Japa: a sua repetição.' },
  { termo: 'OM (Pranava)', significado: 'O som primordial; A-U-M e o silêncio. Símbolo de Ishvara (YS I.27) e dos quatro estados (Mandukya Upanishad).' },
  { termo: 'Kriya', significado: 'Ação; purificação (shatkarmas do Hatha: neti, dhauti, nauli, basti, kapalabhati, trataka). Kriya Yoga em Patanjali: tapas, svadhyaya, ishvara pranidhana.' },
  { termo: 'Yama / Niyama', significado: 'Disciplinas éticas e pessoais, os dois primeiros membros do Raja Yoga.' },
  { termo: 'Ahimsa', significado: 'Não-violência, em ação, palavra e pensamento. O primeiro yama.' },
  { termo: 'Satya', significado: 'Verdade; honestidade.' },
  { termo: 'Santosha', significado: 'Contentamento com o que há.' },
  { termo: 'Tapas', significado: 'Calor, ardor, disciplina; a energia do esforço consciente.' },
  { termo: 'Svadhyaya', significado: 'Estudo de si e dos textos; autoconhecimento.' },
  { termo: 'Ishvara Pranidhana', significado: 'Entrega a Ishvara, à ordem maior; largar o controlo do resultado.' },
  { termo: 'Ishvara', significado: 'O Senhor; em Patanjali, a consciência livre e modelo (I.24); no Vedanta, a totalidade manifesta como ordem.' },
  { termo: 'Pratyahara', significado: 'Recolhimento dos sentidos.' },
  { termo: 'Dharana / Dhyana / Samadhi', significado: 'Concentração, meditação e absorção: os três membros interiores (samyama).' },
  { termo: 'Citta / Vritti', significado: 'Mente (memória, intelecto, ego) e as suas flutuações ou ondas.' },
  { termo: 'Klesha', significado: 'Aflição: avidya (ignorância), asmita (ego), raga (apego), dvesha (aversão), abhinivesha (medo da morte).' },
  { termo: 'Avidya', significado: 'Não ver, ignorância da própria natureza; raiz das aflições.' },
  { termo: 'Abhyasa / Vairagya', significado: 'Prática constante e desapego: as duas asas do yoga (YS I.12).' },
  { termo: 'Sankalpa', significado: 'Intenção, resolução; formulada curta e positiva, no início da prática e no Yoga Nidra.' },
  { termo: 'Drishti', significado: 'Ponto de foco do olhar numa postura; estabiliza a mente.' },
  { termo: 'Sakshi', significado: 'A testemunha; a consciência que observa sem se envolver.' },
  { termo: 'Atma / Atman', significado: 'O eu, a consciência; a própria natureza.' },
  { termo: 'Brahman', significado: 'A realidade absoluta, ilimitada; o Vedanta ensina que atma é Brahman.' },
  { termo: 'Sat-Chit-Ananda', significado: 'Existência, consciência, plenitude: a natureza do eu.' },
  { termo: 'Maya', significado: 'O poder de aparência; aquilo que faz o uno parecer múltiplo.' },
  { termo: 'Jiva', significado: 'O indivíduo, o eu identificado com corpo e mente.' },
  { termo: 'Guna', significado: 'Qualidade da natureza: sattva (clareza, equilíbrio), rajas (atividade, agitação), tamas (inércia, peso). A prática procura sattva.' },
  { termo: 'Kosha', significado: 'Invólucro: annamaya (alimento), pranamaya (energia), manomaya (mente), vijnanamaya (intelecto), anandamaya (alegria).' },
  { termo: 'Samskara / Vasana', significado: 'Impressões deixadas pelas ações e tendências latentes que condicionam o comportamento.' },
  { termo: 'Karma', significado: 'Ação e o seu resultado; a lei de causa e efeito. Prarabdha: a parte que já está a dar fruto nesta vida.' },
  { termo: 'Dharma', significado: 'Ordem, retidão, dever; o que sustenta.' },
  { termo: 'Moksha', significado: 'Liberdade, libertação; o fim da sensação de limitação.' },
  { termo: 'Purusharthas', significado: 'As quatro buscas humanas: artha, kama, dharma, moksha.' },
  { termo: 'Viveka / Vairagya', significado: 'Discernimento (entre o real e o aparente) e desapego: pré-requisitos do conhecimento no Vedanta.' },
  { termo: 'Shravana, Manana, Nididhyasana', significado: 'Ouvir, refletir, contemplar: os três passos do estudo do Vedanta.' },
  { termo: 'Mahavakya', significado: 'Grande frase das Upanishads: Tat tvam asi (Tu és Isso), Aham Brahmasmi (Eu sou Brahman).' },
  { termo: 'Upanishad', significado: 'Textos finais dos Vedas, base do Vedanta ("sentar-se perto", aos pés do mestre).' },
  { termo: 'Bhagavad Gita', significado: 'O "Canto do Senhor": diálogo de Krishna e Arjuna; síntese de karma, bhakti e jnana yoga.' },
  { termo: 'Hatha Yoga Pradipika', significado: 'Texto clássico do Hatha (Svatmarama, séc. XV): asanas, pranayama, mudras, samadhi.' },
  { termo: 'Agni', significado: 'Fogo; o fogo digestivo e da transformação (manipura).' },
  { termo: 'Langhana / Brahmana', significado: 'Práticas que reduzem e acalmam / que expandem e energizam (base dos filtros "calmante" e "energizante").' },
  { termo: 'Sthira / Sukha', significado: 'Firmeza e conforto: as duas qualidades da asana.' },
  { termo: 'Namaste', significado: 'Saudação: "inclino-me perante ti"; reconhecimento da mesma consciência no outro.' },
  { termo: 'Shanti', significado: 'Paz. Repetido três vezes: paz nos três níveis (individual, do mundo, cósmico).' },
  { termo: 'Guru', significado: 'Aquele que remove a escuridão (gu) com a luz (ru); o professor na linha de transmissão (parampara).' },
  { termo: 'Sadhana', significado: 'Prática espiritual regular; o caminho que se percorre.' },
]
