import {Game} from "./game.js";
import {GamePrinter} from "./drawingLib.js";

const canvas = document.getElementById('playground');

if(canvas.getContext) {
    const context = canvas.getContext('2d');

    const game = new Game();
    const printer = new GamePrinter(context);

    game.start().then(()=>{
        console.log('Game: ', game);
        const heatWidth = (context.canvas.width - 40) / game.heats.length;
        for(let i = 0; i < game.heats.length; i++) {
            printer.drawHeat({x: 20 + i * heatWidth, y: 30}, game.heats[i]);
        }
    });

} else {
    console.log('Canvas not supported!');
}