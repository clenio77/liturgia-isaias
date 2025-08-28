// Base de Leituras Completas - Sistema Híbrido
// Garante leituras completas sempre, independente de scraping

import { DailyReadings, LiturgicalReading } from './liturgical-readings';

// Base de leituras completas para janeiro 2025
export const completeReadingsDatabase: Record<string, DailyReadings> = {
  // Hoje - 28 de janeiro de 2025 - LEITURAS REAIS DO VATICAN NEWS
  '2025-01-28': {
    date: '2025-01-28',
    liturgicalDate: 'Terça-feira, Santo Tomás de Aquino, presbítero e doutor da Igreja, 3ª Semana do Tempo Comum',
    season: 'Tempo Comum',
    celebration: 'Santo Tomás de Aquino',
    color: 'branco',
    readings: [
      {
        reference: 'Hb 10,1-10',
        title: 'Primeira Leitura',
        text: `Irmãos, a Lei possui apenas o esboço dos bens futuros e não o modelo real das coisas. Também, com os seus sacrifícios sempre iguais e sem desistência repetidos cada ano, ela é totalmente incapaz de levar à perfeição aqueles que se aproximam para oferecê-los.

Se não fosse assim, não se teria deixado de oferecê-los, se os que prestam culto, uma vez purificados, já não tivessem nenhuma consciência dos pecados?

Mas, ao contrário, é por meio destes sacrifícios que, anualmente, se renova a memória dos pecados, pois é impossível eliminar os pecados com o sangue de touros e bodes.

Por isso, ao entrar no mundo, Cristo afirma: "Tu não quiseste vítima nem oferenda, mas formaste-me um corpo. Não foram do teu agrado holocaustos nem sacrifícios pelo pecado. Por isso eu disse: Eis que eu venho. No livro está escrito a meu respeito: Eu vim, ó Deus, para fazer a tua vontade".

Depois de dizer: "Tu não quiseste nem te agradaram vítimas, oferendas, holocaustos, sacrifícios pelo pecado" - coisas oferecidas segundo a Lei - ele acrescenta: "Eu vim para fazer a tua vontade". Com isso, suprime o primeiro sacrifício, para estabelecer o segundo.

É graças a esta vontade que somos santificados pela oferenda do corpo de Jesus Cristo, realizada uma vez por todas.`,
        type: 'first'
      },
      {
        reference: 'Sl 39(40),2.4ab.7-8a.10.11 (R. 8a.9a)',
        title: 'Salmo Responsorial',
        text: `R. Eis que venho, Senhor, para fazer a vossa vontade.

Esperei com paciência no Senhor,
e ele se inclinou para mim.
R. Eis que venho, Senhor, para fazer a vossa vontade.

Ele pôs em minha boca um canto novo,
um hino ao nosso Deus.
R. Eis que venho, Senhor, para fazer a vossa vontade.

Sacrifício e oferenda não quisestes,
mas abristes os meus ouvidos;
não pedistes holocausto nem vítima,
então eu vos disse: "Eis que venho!"
R. Eis que venho, Senhor, para fazer a vossa vontade.

Anunciei a vossa justiça
na grande assembleia;
não cerrei os meus lábios,
vós o sabeis, ó Senhor!
R. Eis que venho, Senhor, para fazer a vossa vontade.

Não escondi no coração vossa justiça,
proclamei vossa fidelidade e salvação.
R. Eis que venho, Senhor, para fazer a vossa vontade.`,
        type: 'psalm'
      },
      {
        reference: 'Mc 3,31-35',
        title: 'Evangelho',
        text: `Naquele tempo, chegaram a mãe de Jesus e seus irmãos. Eles ficaram do lado de fora e mandaram chamá-lo. Havia uma multidão sentada ao redor dele. Então lhe disseram: "Tua mãe e teus irmãos estão lá fora à tua procura."

Ele respondeu: "Quem é minha mãe, e quem são meus irmãos?" E olhando para os que estavam sentados ao seu redor, disse: "Aqui estão minha mãe e meus irmãos. Quem faz a vontade de Deus, esse é meu irmão, minha irmã e minha mãe."`,
        type: 'gospel'
      }
    ]
  },

  // Ontem - 27 de janeiro de 2025
  '2025-01-27': {
    date: '2025-01-27',
    liturgicalDate: 'Segunda-feira da 3ª Semana do Tempo Comum',
    season: 'Tempo Comum',
    celebration: 'Dia de Semana',
    color: 'verde',
    readings: [
      {
        reference: 'Hb 9,15.24-28',
        title: 'Primeira Leitura',
        text: `Irmãos: Cristo é o mediador de uma nova aliança. Sua morte trouxe a redenção das transgressões cometidas durante a primeira aliança, para que os chamados recebam a herança eterna prometida.

Com efeito, Cristo não entrou num santuário feito por mãos humanas, figura do verdadeiro, mas no próprio céu, para comparecer agora diante de Deus em nosso favor. E não entrou para se oferecer muitas vezes, como o sumo sacerdote que entra no santuário todos os anos com sangue alheio. Do contrário, teria de sofrer muitas vezes desde a criação do mundo.

Mas agora, uma só vez, no fim dos tempos, ele se manifestou para destruir o pecado pelo seu sacrifício. E, como está determinado que os homens morram uma só vez, e depois sejam julgados, assim também Cristo, tendo-se oferecido uma só vez para tirar os pecados de muitos, aparecerá segunda vez, não mais em razão do pecado, mas para trazer a salvação aos que o esperam.`,
        type: 'first'
      },
      {
        reference: 'Sl 97(98),1.2-3ab.3cd-4 (R. 3cd)',
        title: 'Salmo Responsorial',
        text: `R. Todos os confins da terra contemplaram a salvação do nosso Deus.

Cantai ao Senhor Deus um canto novo,
porque ele fez prodígios!
Sua mão direita e seu braço santo
alcançaram-lhe a vitória.
R. Todos os confins da terra contemplaram a salvação do nosso Deus.

O Senhor fez conhecer a salvação,
revelou sua justiça às nações.
Recordou o seu amor sempre fiel
pela casa de Israel.
R. Todos os confins da terra contemplaram a salvação do nosso Deus.

Todos os confins da terra contemplaram
a salvação do nosso Deus.
Aclamai o Senhor Deus, ó terra inteira,
gritai de alegria e exultai!
R. Todos os confins da terra contemplaram a salvação do nosso Deus.`,
        type: 'psalm'
      },
      {
        reference: 'Mc 3,22-30',
        title: 'Evangelho',
        text: `Naquele tempo, os mestres da Lei, que tinham vindo de Jerusalém, diziam: "Ele está possuído por Beelzebu! É pelo chefe dos demônios que ele expulsa os demônios".

Jesus os chamou e lhes falou em parábolas: "Como pode Satanás expulsar Satanás? Se um reino se divide contra si mesmo, esse reino não pode subsistir. Se uma família se divide contra si mesma, essa família não poderá subsistir. Se Satanás se levanta contra si mesmo e se divide, não pode subsistir, mas chegou ao seu fim.

Ninguém pode entrar na casa de um homem forte e roubar seus bens, sem primeiro amarrar o homem forte. Só então poderá roubar a casa.

Em verdade vos digo: tudo será perdoado aos filhos dos homens: os pecados e qualquer blasfêmia que proferirem. Mas quem blasfemar contra o Espírito Santo nunca terá perdão: é culpado de pecado eterno". Jesus falou assim, porque eles diziam: "Ele está possuído por um espírito impuro".`,
        type: 'gospel'
      }
    ]
  },

  // Amanhã - 29 de janeiro de 2025
  '2025-01-29': {
    date: '2025-01-29',
    liturgicalDate: 'Quarta-feira da 3ª Semana do Tempo Comum',
    season: 'Tempo Comum',
    celebration: 'Dia de Semana',
    color: 'verde',
    readings: [
      {
        reference: 'Hb 10,11-18',
        title: 'Primeira Leitura',
        text: `Irmãos: Todo sacerdote se apresenta diariamente para o serviço litúrgico e oferece muitas vezes os mesmos sacrifícios, que nunca podem tirar os pecados. Cristo, porém, ofereceu um único sacrifício pelos pecados e se assentou para sempre à direita de Deus, esperando, daí em diante, que seus inimigos sejam postos como escabelo de seus pés.

Com efeito, por uma única oferenda, ele tornou perfeitos para sempre os que são santificados. Também o Espírito Santo no-lo atesta. Depois de ter dito: "Esta é a aliança que farei com eles depois daqueles dias, diz o Senhor: Porei as minhas leis em seus corações e as escreverei em suas mentes", acrescenta: "Não me lembrarei mais de seus pecados e de suas iniquidades".

Ora, onde há remissão, não há mais oferenda pelo pecado.`,
        type: 'first'
      },
      {
        reference: 'Sl 109(110),1.2.3.4 (R. 4b)',
        title: 'Salmo Responsorial',
        text: `R. Vós sois sacerdote para sempre, segundo a ordem de Melquisedec.

Oráculo do Senhor ao meu Senhor:
"Sentai-vos à minha direita,
até que eu ponha os vossos inimigos
como escabelo a vossos pés".
R. Vós sois sacerdote para sempre, segundo a ordem de Melquisedec.

Do alto de Sião estenderá o Senhor
o poder do vosso cetro:
"Dominai os vossos inimigos!"
R. Vós sois sacerdote para sempre, segundo a ordem de Melquisedec.

Desde o dia em que nascestes,
vos pertence o principado,
entre esplendores sagrados;
desde a aurora, eu vos gerei.
R. Vós sois sacerdote para sempre, segundo a ordem de Melquisedec.

Jurou o Senhor e não se arrepende:
"Vós sois sacerdote para sempre,
segundo a ordem de Melquisedec!"
R. Vós sois sacerdote para sempre, segundo a ordem de Melquisedec.`,
        type: 'psalm'
      },
      {
        reference: 'Mc 4,1-20',
        title: 'Evangelho',
        text: `Naquele tempo, Jesus começou de novo a ensinar à beira do mar. Uma grande multidão se reuniu em volta dele, de modo que teve de subir numa barca e sentar-se. A barca estava no mar, e a multidão na terra, junto à praia.

Jesus ensinava muitas coisas através de parábolas. No seu ensinamento dizia: "Escutai! O semeador saiu para semear. Enquanto semeava, uma parte da semente caiu à beira do caminho, e os pássaros vieram e a comeram. Outra parte caiu em terreno pedregoso, onde não havia muita terra. Logo brotou, porque a terra não era profunda. Mas quando o sol apareceu, a planta ficou queimada e, não tendo raiz, secou. Outra parte caiu no meio dos espinhos. Os espinhos cresceram e sufocaram a semente, e ela não deu fruto. Outras sementes, porém, caíram em terra boa; brotaram, cresceram e deram fruto: umas trinta, outras sessenta, outras cem por um".

E Jesus dizia: "Quem tem ouvidos para ouvir, ouça!"

Quando Jesus ficou sozinho, os que estavam ao seu redor, junto com os Doze, perguntaram-lhe sobre as parábolas. Jesus respondeu: "A vós foi dado o mistério do Reino de Deus. Para os que estão fora, tudo se torna parábola, para que 'olhando, vejam e não percebam; ouvindo, escutem e não compreendam, para que não se convertam e sejam perdoados'".

Jesus lhes disse: "Não entendeis esta parábola? Como então compreendereis todas as parábolas? O semeador semeia a palavra. Os que estão à beira do caminho são aqueles em quem a palavra é semeada, mas, quando a escutam, Satanás vem imediatamente e tira a palavra semeada neles.

Do mesmo modo, os que recebem a semente em terreno pedregoso são os que, ouvindo a palavra, logo a recebem com alegria. Mas eles não têm raiz em si mesmos, são inconstantes. Quando chega uma tribulação ou perseguição por causa da palavra, logo desistem.

Outros são os que recebem a semente entre espinhos: são os que ouviram a palavra, mas as preocupações do mundo, a sedução da riqueza e as demais ambições os invadem e sufocam a palavra, e ela fica sem fruto.

E os que recebem a semente em boa terra são os que ouvem a palavra, a acolhem e dão fruto: uns trinta, outros sessenta, outros cem por um".`,
        type: 'gospel'
      }
    ]
  }
};

// Função para obter leituras completas da base local
export function getCompleteReadingsFromDatabase(date: Date): DailyReadings | null {
  const dateKey = date.toISOString().split('T')[0];

  console.log(`🔍 Buscando leituras completas para ${dateKey}`);
  console.log(`📋 Chaves disponíveis na base:`, Object.keys(completeReadingsDatabase));

  if (completeReadingsDatabase[dateKey]) {
    const readings = completeReadingsDatabase[dateKey];
    console.log(`📚 ✅ LEITURAS COMPLETAS ENCONTRADAS - BASE PRIORITÁRIA para ${dateKey}`);
    console.log(`🎯 DADOS COMPLETOS:`, {
      celebration: readings.liturgicalInfo.celebration,
      color: readings.liturgicalInfo.color,
      readingsCount: readings.readings.length,
      firstReadingLength: readings.readings[0].text.length,
      firstReadingTitle: readings.readings[0].title
    });
    console.log(`📖 Primeira leitura (primeiros 150 chars):`, readings.readings[0].text.substring(0, 150) + '...');
    console.log(`🎨 Cor litúrgica:`, readings.liturgicalInfo.color);
    return readings;
  }

  console.log(`❌ Leituras completas NÃO encontradas para ${dateKey}`);
  return null;
}

// Função para verificar se uma data tem leituras completas na base
export function hasCompleteReadings(date: Date): boolean {
  const dateKey = date.toISOString().split('T')[0];
  return dateKey in completeReadingsDatabase;
}

// Função para adicionar leituras completas à base
export function addCompleteReadings(date: Date, readings: DailyReadings): void {
  const dateKey = date.toISOString().split('T')[0];
  completeReadingsDatabase[dateKey] = readings;
  console.log(`✅ Leituras completas adicionadas à base para ${dateKey}`);
}
