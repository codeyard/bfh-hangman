
export class Hangman{
    constructor() {
        this.context = document.getElementById('hangman_drawing').getContext('2d');
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.hangStep = 0;
        this.steps = [
            this.clearField,
            this._drawFloor,
            this._drawPole,
            this._drawBar,
            this._drawRope,
            this._drawHead,
            this._drawBody,
            this._drawFeet
        ];
    }

    _printStep(step){
        for(let i = 0; i <= step && i < this.steps.length; i++){
            this.steps[i].call(this);
        }
    }

    nextStep(){
        this.hangStep++;
        this._printStep(this.hangStep);
    }

    areYouDead(){
        return this.hangStep >= this.steps.length - 1;
    }

    resetStep(){
        this.hangStep = 0;
        this._printStep(this.hangStep);
    }

    clearField(){
        this.context.clearRect(0, 0, this.width, this.height);
    }

    _drawFloor(){
        this.context.beginPath();
        this.context.moveTo(0,this.height - 5);
        this.context.lineTo(this.width,this.height - 5);
        this.context.stroke();
    }

    _drawPole(){
        this.context.beginPath();
        this.context.moveTo(this.width * 3 / 4, 10);
        this.context.lineTo(this.width * 3 / 4, this.height - 5);
        this.context.stroke();
    }

    _drawBar(){
        this.context.beginPath();
        this.context.moveTo(this.width * 3 / 4 + 10, 20);
        this.context.lineTo(this.width / 3, 20);
        this.context.stroke();
    }

    _drawRope(){
        this.context.beginPath();
        this.context.moveTo(this.width / 3 + 5, 20);
        this.context.lineTo(this.width / 3 + 5, this.height / 3);
        this.context.stroke();
    }

    _drawHead(){
        this.context.beginPath();
        this.context.arc(this.width / 3 + 5, this.height / 3 + 10, 10, 0, Math.PI * 2);
        this.context.closePath();
        this.context.stroke();
    }

    _drawBody(){
        this.context.beginPath();
        this.context.moveTo(this.width / 3 + 5, this.height / 3 + 20);
        this.context.lineTo(this.width / 3 + 5, this.height / 3 + 20 + 40);
        this.context.moveTo(this.width / 3 - 15, this.height / 3 + 40);
        this.context.lineTo(this.width / 3 + 25, this.height / 3 + 40);
        this.context.stroke();
    }

    _drawFeet(){
        this.context.beginPath();
        this.context.moveTo(this.width / 3 + 5, this.height / 3 + 60);
        this.context.lineTo(this.width / 3 + 25, this.height / 3 + 80);
        this.context.moveTo(this.width / 3 + 5, this.height / 3 + 60);
        this.context.lineTo(this.width / 3 - 15, this.height / 3 + 80);
        this.context.stroke();
    }
}
