import {Hangman} from "./hangman.js";

export class Game {
    constructor() {
        this.dropzone = document.querySelector('#dropzone');
        this.alphabet = document.querySelector('.input-fields__alphabet');
        this.solution = document.querySelector('.input-fields__solution');
        this.gameStatus = document.querySelector('.game-status');

        this.initDropListener();
        this.hang = new Hangman();
        this.init();
    }

    init() {
        this.secretWord = generateWord();
        this.lettersLeft = this.secretWord.length;
        this.createAlphabet();
        this.initSolution();
        this.hang.resetStep();
        this.dropzone.setAttribute('placeholder', 'Drag letters here');
        this.gameStatus.style.display = 'none';
    }

    initDropListener() {
        this.dropzone.addEventListener('drop', (event) => {
            event.preventDefault();
            const letter = event.dataTransfer.getData('text/plain');
            const divContainer = document.querySelector('#' + letter);
            divContainer.classList.add('disabled');
            divContainer.setAttribute('draggable', 'false');
            this.processLetter(letter);
            this.dropzone.setAttribute('placeholder', '');
        })
    }

    createAlphabet() {
        this.alphabet.innerHTML = '';
        for (let i = 0; i < 26; i++) {
            let divContainer = document.createElement('div');
            let spanElement = document.createElement('span');
            const letter = (i + 10).toString(36).toUpperCase();
            divContainer.id = letter;
            divContainer.setAttribute('draggable', 'true');
            divContainer.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', event.target.id);
            })
            divContainer.classList.add('letter-container');
            spanElement.innerHTML = letter;
            spanElement.classList.add('letter');
            divContainer.appendChild(spanElement);
            this.alphabet.appendChild(divContainer);
        }
    }

    initSolution() {
        this.solution.innerHTML = '';
        const letters = this.secretWord.split('');
        letters.forEach(() => {
            let divElement = document.createElement('div');
            let spanElement = document.createElement('span');
            spanElement.innerHTML = '&nbsp;';
            divElement.appendChild(spanElement);
            divElement.classList.add('placeholder');
            this.solution.appendChild(divElement);
        })
    }

    processLetter(letter) {
        const positions = this.secretWord.split('').reduce(function (a, e, i) {
            if (e === letter)
                a.push(i);
            return a;
        }, []);

        positions.length ? this.drawLetters(positions, letter) : this.hangMeMore();
    }

    drawLetters(positions, letter) {
        const elements = this.solution.querySelectorAll('span');
        positions.forEach(pos => {
            elements[pos].innerHTML = letter;
            elements[pos].classList.add("solution-letter")
            this.lettersLeft--;
        });
        if (this.lettersLeft < 1) {
            this.gameIsOver(true);
        }
    }

    hangMeMore() {
        this.hang.nextStep();
        if (this.hang.areYouDead()) {
            this.gameIsOver(false);
        }
    }

    gameIsOver(successful) {
        const remainingLetters = this.alphabet.querySelectorAll('div');
        remainingLetters.forEach(letter => {
            letter.classList.add('disabled');
            letter.setAttribute('draggable', 'false');
        })
        setTimeout(() => {
            this.gameStatus.innerHTML = successful ? 'Well done 👍' : 'Game over 😥';
            this.gameStatus.style.display = 'block';
            this.restartGame();
        }, 1000);
    }

    restartGame() {
        setTimeout(() => {
            this.init();
        }, 4000)
    }
}

function generateWord() {

    const words = [
        'SCHWEIZ',
        'BELGIEN',
        'DAENEMARK',
        'DEUTSCHLAND',
        'ENGLAND',
        'FINNLAND',
        'FRANKREICH',
        'ITALIEN',
        'KROATIEN',
        'NIEDERLANDE',
        'NORDMAZEDONIEN',
        'OESTERREICH',
        'POLEN',
        'PORTUGAL',
        'RUSSLAND',
        'SCHOTTLAND',
        'SCHWEDEN',
        'SLOWAKEI',
        'SPANIEN',
        'TSCHECHIEN',
        'TUERKEI',
        'UKRAINE',
        'UNGARN',
        'WALES'
    ];

    const index = Math.floor((Math.random() * words.length));
    return words[index];
}
