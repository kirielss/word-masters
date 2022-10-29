const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const cell = document.querySelector('.cell');

// variavel da palavra vinda da promise
let word;

// variavel da tentativa do usuario
let tryout = '';

// variavel contador de tentativa
let row = 0;

// variavel do nth elemento no HTML
let nth;

async function getWord() {
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    word = processedResponse.word;
    return;
}

document.addEventListener("keydown", (event) => {
        writeWord(event.key)
})

// função para armazenar letra digitada na variável tryout.
function writeWord(letter) {
    // verifica se o caractere digitado é uma letra do alfabeto. Se sim, armazena até ter 5 letras
    if ((tryout.length < 5) && (/^[a-zA-Z]$/.test(letter))) {
        tryout += letter;
        console.log(tryout);
        writeLetter(letter);

    // apaga letra com backspace
    } else if (letter === 'Backspace') {
        tryout = tryout.slice(0, -1);
        eraseLetter(letter);

    // valida a tentativa com enter
    } else if ((tryout.length === 5) && (letter === 'Enter')) {
        console.log('validando tentativa');
        row++;
        if (row > 5) {
            alert('GAME OVER');
        }
        tryout = '';
    }
}

// escreve a letra no bloco
function writeLetter(x) {
    nthConverter();
    console.log(nthConverter());
    document.querySelector(nthConverter()).innerText = x;
}

// apaga a letra do bloco
/*
function eraseLetter(x) {

}
*/

    // calcula qual elemento a escrever no HTML e converte para string
function nthConverter() {
    nth = (tryout.length + (5 * row));
    return ('.cell:nth-of-type(' + nth + ')');
}



// ideia css: position fixed dark mode toggle