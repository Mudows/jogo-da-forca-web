$(document).ready(function () {
  // Palavra a ser adivinhada
  let wordToGuess;

  // Letras já tentadas
  let guesses = [];

  // Número de tentativas restantes
  let remainingGuesses;

  // Elementos do DOM
  const $wordDisplay = $('#word-display');
  const $guessesDisplay = $('#guesses-display');
  const $letterInput = $('#letter-input');
  const $guessButton = $('#guess-button');

  // Função para exibir o significado da palavra
  function showDefinition(word) {
    word = word.toLowerCase();
    $.get('https://api.dicionario-aberto.net/word/' + word, function (data) {
      // Obtém o significado da palavra da resposta da API
      console.log(data);
      const definition = data[0].xml;

      // Converte o XML para um objeto DOM
      const xmlDoc = $.parseXML(definition);
      const $xml = $(xmlDoc);

      // Obtém o texto da primeira tag "def"
      const defText = $xml.find('def').eq(0).text();

      // Exibe o significado da palavra em um alerta
      alert('A palavra era "' + word + '" e seu significado é:\n' + defText);
    });
  }

  function validateWord(word) {
    // Verifica se a palavra contém Ç ou caracteres acentuados
    const regex = /[Ççáàãâéèêíìóòõôúùûü]/;
    if (regex.test(word)) {
      alert(
        'Palavras com Ç ou acentuação não são permitidas. Tente novamente.'
      );
      return false;
    }
    return true;
  }

  // Inicia o jogo
  function startGame() {
    // Reseta as variáveis
    guesses = [];
    remainingGuesses = 6;

    // Busca uma palavra aleatória da API
    $.get(
      'https://cors-anywhere.herokuapp.com/https://api.dicionario-aberto.net/random',
      function (data) {
        let word = data.word.toLowerCase();
        console.log(word);

        // Valida a palavra
        if (!validateWord(word)) {
          startGame(); // tenta novamente se a palavra não for válida
          return;
        }

        // Exibe a palavra a ser adivinhada
        wordToGuess = word.toUpperCase();
        $wordDisplay.html(wordToGuess.replace(/\w/g, '_ '));

        // Exibe as tentativas restantes
        $guessesDisplay.html('Tentativas restantes: ' + remainingGuesses);
      }
    );
  }

  // Verifica se o jogador ganhou o jogo
  function checkWin() {
    if (wordToGuess === $wordDisplay.text().replace(/ /g, '')) {
      showDefinition(wordToGuess);
      startGame();
    }
  }

  // Verifica se o jogador perdeu o jogo
  function checkLoss() {
    if (remainingGuesses === 0) {
      showDefinition(wordToGuess);
      startGame();
    }
  }

  // Verifica se a letra já foi tentada
  function checkGuess(letter) {
    if (guesses.indexOf(letter) === -1) {
      guesses.push(letter);
      return true;
    }
    return false;
  }

  // Verifica se a letra está na palavra
  function checkLetter(letter) {
    if (wordToGuess.indexOf(letter) !== -1) {
      return true;
    }
    return false;
  }

  // Atualiza a palavra a ser adivinhada
  function updateWord(letter) {
    let word = $wordDisplay.text().split(' ');
    for (let i = 0; i < wordToGuess.length; i++) {
      if (wordToGuess[i] === letter) {
        word[i] = letter;
      }
    }
    $wordDisplay.html(word.join(' '));
  }

  // Atualiza as tentativas restantes
  function updateGuesses() {
    remainingGuesses--;
    $guessesDisplay.html('Tentativas restantes: ' + remainingGuesses);
  }

  // Inicia o jogo
  startGame();

  // Evento de clique no botão de tentativa
  $guessButton.on('click', function () {
    let letter = $letterInput.val().toUpperCase();
    if (checkGuess(letter)) {
      if (checkLetter(letter)) {
        updateWord(letter);
        checkWin();
      } else {
        updateGuesses();
        checkLoss();
      }
      $letterInput.val('');
    }
  });
});
