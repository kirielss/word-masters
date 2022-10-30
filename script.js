const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
let wordArray;
let tryoutArray;

// variavel que checa se o jogo acabou
let gameOver = false;

// variavel da palavra vinda da promise
let word;

// variavel da tentativa do usuario
let tryout = '';

// variavel contador de tentativa
let row = 0;

// variavel do nth elemento no HTML
let nth;

// variavel da tentativa a ser validada como string de objeto
let guess;

// variavel booleana indicando se a palavra é válida
let valid;

// função async para pegar a palavra do dia
async function getWord() {
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    word = processedResponse.word;
    wordArray = word.split("")
    return;
}
getWord();

// função async para checar se a palavra é valida
async function postWord() {
    document.querySelector('.loading').style.display = 'block';
    const response = await fetch('https://words.dev-apis.com/validate-word', {
        method: 'POST',
        body: guess
    })
    const processedResult = await response.json();
    valid = processedResult.validWord;

    document.querySelector('.loading').style.display = 'none';

    if (valid) {
        check(tryout);
        row++;
        if (row > 5) {
            alert('Que pena, você perdeu... A palavra correta era ' + word);
            gameOver = true;
        }
        tryout = '';
    } else {
        alert('Por favor, somente palavras em inglês.')
    }
}

// event listener para escutar o input do usuário
document.addEventListener("keydown", (event) => {
    // checa se o jogo já acabou antes de inserir input
    if (!gameOver)
    writeWord(event.key);
})

// função para armazenar letra digitada na variável tryout.
function writeWord(letter) {

    // verifica se o caractere digitado é uma letra do alfabeto. Se sim, armazena até ter 5 letras
    if ((tryout.length < 5) && (/^[a-zA-Z]$/.test(letter))) {
        tryout += letter;
        writeLetter(letter);

    // apaga letra com backspace
    } else if ((letter === 'Backspace') && (tryout !== '')) {
        eraseLetter(letter);
        tryout = tryout.slice(0, -1);

    // valida a tentativa com enter
    } else if ((tryout.length === 5) && (letter === 'Enter')) {
        prepare(tryout);
        postWord()

    }
}

// escreve a letra no bloco
function writeLetter(x) {
    document.querySelector(nthConverter(tryout.length)).innerText = x;
}

// apaga a letra do bloco
function eraseLetter(x) {
    document.querySelector(nthConverter(tryout.length)).innerText = '';
}

// calcula qual elemento a escrever no HTML e converte para string
function nthConverter(position) {
    nth = (position + (5 * row));
    return ('.cell:nth-of-type(' + nth + ')');
}

// prepara a tentativa criando o objeto e convertendo em string
function prepare(trial) {
    const challenge = {
        "word": trial,
    };
    guess = JSON.stringify(challenge);
}

// checa se o usuário acertou
function check(input) {

    // caso de acerto
    if (input === word) {
        winner();
    }
    else {

        // converte a tentativa em array para fazer a checagem
        tryoutArray = input.split("");

        // converte tudo em cinza primeiro pois é a condição com menor prioridade
        turnGray();

        // roda um for para equiparar os arrays
        for (let i=0; i < 5; i++) {
            // usuário acertou a letra e a posição
            if (tryoutArray[i] === wordArray[i]) {
                turnGreen(i+1);
            }
            else {

                // roda um segundo for para checar todas as combinações possíveis
                for (let y=0; y<5; y++) {
                    // usuário acertou a letra mas errou a posição
                    if (tryoutArray[i] === wordArray[y]) {
                        turnYellow(i+1);
                    }
                }
            }
        }
    }
}

// função converte em verde
function turnGreen(index) {
    document.querySelector(nthConverter(index)).style.backgroundColor = 'green';
}

// função converte em amarelo
function turnYellow(index) {
    document.querySelector(nthConverter(index)).style.backgroundColor = 'yellow';
}

// função converte tudo em cinza (a rodar primeiro)
function turnGray() {
    for (let z=0;z<5;z++){
        document.querySelector(nthConverter(z+1)).style.backgroundColor = 'gray';
        document.querySelector(nthConverter(z+1)).style.color = 'white';
    }
}

// função parabeniza o vencedor por acertar a palavra
function winner() {
    document.querySelector('.hidden').style.display = 'block'

    for (let x=0;x<5;x++) {
        document.querySelector(nthConverter(x+1)).style.backgroundColor = 'black';
        document.querySelector(nthConverter(x+1)).style.color = 'gold';
    }
    gameOver = true;
}