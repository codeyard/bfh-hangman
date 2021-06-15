
function drawLabel(context, position){
    context.beginPath();
    context.arc(position.x, position.y - position.margin, position.height / 2, Math.PI / 2, -Math.PI / 2);
    context.arc(position.x + position.width, position.y - position.margin, position.height / 2, -Math.PI / 2, Math.PI / 2);
    context.lineTo(position.x, position.y + 2 * position.margin);
    context.moveTo(position.x + position.textSize + position.height / 2, position.y - position.margin + position.height / 2);
    context.arc(position.x + position.textSize + position.height / 2, position.y - position.margin, position.height / 2, Math.PI / 2, -Math.PI / 2);
    context.stroke();
}

export class GamePrinter{

    constructor(context) {
        this.context = context;
    }

    drawHeat(initialPosition, heat){
        this.context.font = '20px Sans-Serif';
        this.context.fillStyle = 'Black';
        this.context.textAlign = 'center';

        const fieldWidth = 100;
        const textWidth = 75;

        this.context.fillText(`Heat ${heat.part}`, initialPosition.x + fieldWidth / 2, initialPosition.y, fieldWidth);

        for(let i = 0; i < heat.players.length; i++) {

            drawLabel(this.context, {
                x: initialPosition.x,
                y: initialPosition.y + 50 * (i + 1),
                width: fieldWidth,
                height: 30,
                margin: 5,
                textSize: textWidth
            });

            this.context.fillStyle = 'Blue';
            this.context.fillText(heat.players[i].name, initialPosition.x + textWidth / 2, initialPosition.y + 50 * (i + 1), textWidth);

            this.context.fillStyle = 'Black';
            this.context.fillText(heat.players[i].points, initialPosition.x + textWidth + (fieldWidth - textWidth) / 2 + 7.5, initialPosition.y + 50 * (i + 1), fieldWidth - textWidth);
        }
    }
}