import {Game} from './game.js';

const game = new Game();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register("./serviceWorker.js")
        .then(() => console.log("SERVICE WORKER REGISTERED"))
        .catch(e => console.log("SOMETHING WENT WRONG", e))
}
