export class Player{
    constructor(name) {
        this.name = name;
        this.points = 0;
    }
}

export class Heat{
    constructor(round, part) {
        this.players = [];
        this.round = round;
        this.part = part;
    }
}

export function getPlayers() {
    return new Promise(((resolve, reject) => {
        const thePlayers = [];
        thePlayers.push(new Player('Jessica'));
        thePlayers.push(new Player('Phil'));
        thePlayers.push(new Player('Alex'));
        thePlayers.push(new Player('Sandra'));
        thePlayers.push(new Player('Luca'));
        thePlayers.push(new Player('Bratt'));
        thePlayers.push(new Player('Vladimir'));
        thePlayers.push(new Player('Nora'));
        thePlayers.push(new Player('Hella'));
        thePlayers.push(new Player('James'));
        thePlayers.push(new Player('Laura'));
        thePlayers.push(new Player('Robin'));
        thePlayers.push(new Player('Sven'));
        thePlayers.push(new Player('Olga'));
        thePlayers.push(new Player('Zoe'));
        resolve(thePlayers);
    }));
}

export function getRandomSequence(min, max){
    return new Promise(((resolve, reject) => {
        const sequenceArray = [];
        const numberOfElements = max - min;
        if (numberOfElements > 0) {
            for (let i = 0; i < numberOfElements; i++) {
                let currentNumber = 0;
                do {
                    currentNumber = Math.floor(Math.random() * numberOfElements + min);
                } while (sequenceArray.includes(currentNumber));
                sequenceArray.push(currentNumber);
            }
            resolve(sequenceArray);
        } else {
            reject('Wrong numeric range!');
        }
    }));
}
