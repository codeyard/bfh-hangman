import {getPlayers, getRandomSequence, Heat} from "./service.js";

export class Game{
    constructor(){
        this.players = [];
        this.heats = [];
        this.rounds = 0;
        this.currentRound = 0;
        this.winner = {};
    }

    start(){
        return getPlayers()
            .then(res=>{
                this.players = res;
                this.calculateInitialRound();
            })
    }

    calculateInitialRound(){
        if(this.players.length > 0) {
            this.currentRound = 0;
            this.rounds = 0;
            this.winner = {};
            getRandomSequence(0, this.players.length)
                .then(res => {
                    let heatPart = 1;
                    let currentHeat = new Heat(this.currentRound, heatPart);
                    for (const sequence of res) {
                        if (currentHeat.players.length < 4) {
                            currentHeat.players.push(this.players[sequence]);
                        } else {
                            this.heats.push(currentHeat);
                            heatPart++;
                            currentHeat = new Heat(this.currentRound, heatPart);
                            currentHeat.players.push(this.players[sequence]);
                        }
                    }
                    this.heats.push(currentHeat);
                });
        }
    }
}
