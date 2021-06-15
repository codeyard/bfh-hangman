import {Hangman} from "./hangman.js";

export class Game {
    constructor() {
        this.dropzone = document.querySelector('#dropzone');
        this.alphabet = document.querySelector('.input-fields__alphabet');
        this.solution = document.querySelector('.input-fields__solution');

        this.secretWord = generateWord();

        this.initDropListener();
        this.createAlphabet();
        this.initSolution()

        this.hang = new Hangman();
        this.hang.resetStep();
    }

    initDropListener() {
        this.dropzone.addEventListener('drop', (event) => {
            event.preventDefault();
            const letter = event.dataTransfer.getData('text/plain');
            const spanElement = document.querySelector('#' + letter);
            spanElement.classList.add('disabled');
            spanElement.setAttribute('draggable', false);
            this.processLetter(letter);
            this.dropzone.setAttribute('placeholder', '');
        })
    }

    createAlphabet() {
        for (let i = 0; i < 26; i++) {
            let divContainer = document.createElement('div');
            let spanElement = document.createElement('span');
            const letter = (i+10).toString(36).toUpperCase();
            spanElement.innerHTML = letter;
            spanElement.classList.add('letter');
            divContainer.id = letter;
            divContainer.setAttribute('draggable', true);
            divContainer.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', event.target.id);
            })
            divContainer.classList.add('letter-container');
            divContainer.appendChild(spanElement);
            this.alphabet.appendChild(divContainer);
        }
    }

    initSolution() {
        const letters = this.secretWord.split('');
        letters.forEach(letter => {
            let divElement = document.createElement('div');
            let spanElement = document.createElement('span');
            spanElement.innerHTML = '&nbsp;';
            divElement.appendChild(spanElement);
            divElement.classList.add('placeholder');
            this.solution.appendChild(divElement);
        })
    }

    processLetter(letter) {
        const positions = this.secretWord.split('').reduce(function(a, e, i) {
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
        })
    }

    hangMeMore() {
        this.hang.nextStep();
        if (this.hang.areYouDead()) {
            this.gameIsOver();
        }
    }

    gameIsOver() {
        console.log('G A M E   O V E R !!!!')
    }
}

function generateWord(){

    const words = [
        'FRANKREICH',
        'DEUTSCHLAND',
        'SCHWEIZ',
        'SCHWEDEN'
    ];

    const index = Math.floor((Math.random() * words.length));
    return words[index];
}
