
export class Hangman{
    constructor() {
        this.context = document.getElementById('hangman_drawing').getContext('2d');
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.hangStep = 0;
        this.steps = [
            this._clearField,
            this._drawFloor,
            this._drawPole,
            this._drawBar,
            this._drawRope,
            this._drawHead,
            this._drawBody,
            this._drawHands,
            this._drawFeet
        ];
        this.drawConfig = {
            lineWidth : 4,
            lineCap : 'round',
            lineJoin : 'round'
        };
        this.animationConfig = {
            framesForOneStep : 50,
        }
        this.animationStatus = {
            animationRunning : false,
            animationFrame : 0,
            animationStep : 0
        }
    }

    resetStep(){
        this.hangStep = 0;
        this.animationStatus.animationStep = 0;
        this.animationStatus.animationFrame = 0;
        this.animationStatus.animationRunning = true;
        requestAnimationFrame(()=>{this._animate()});
    }

    areYouDead(){
        return this.hangStep >= (this.steps.length - 1);
    }

    nextStep(){
        if(!this.areYouDead()) {
            this.hangStep++;
            if (!this.animationStatus.animationRunning) {
                this.animationStatus.animationRunning = true;
                this.animationStatus.animationFrame = 0;
                requestAnimationFrame(() => {
                    this._animate()
                });
            }
        }
    }

    _animate(){
        // draw
        this._startDrawing();
        this._drawStep();
        this._endDrawing();

        // increase animation frame
        this.animationStatus.animationFrame++;
        if(this.animationStatus.animationFrame >= this.animationConfig.framesForOneStep){
            this.animationStatus.animationFrame = 0;

            // increase animation step
            this.animationStatus.animationStep++;
            if(this.animationStatus.animationStep >= this.hangStep){

                // stop animation
                this.animationStatus.animationRunning = false;
            }
        }

        // callback for next animation needed?
        if(this.animationStatus.animationRunning){
            requestAnimationFrame(()=>{this._animate()});
        }
    }

    _startDrawing(){
        this.context.save();
        this.context.lineWidth = this.drawConfig.lineWidth;
        this.context.lineCap = this.drawConfig.lineCap;
        this.context.lineJoin = this.drawConfig.lineJoin;
    }

    _endDrawing(){
        this.context.restore();
    }

    _drawStep(){
        for(let i = 0; i <= this.animationStatus.animationStep; i++){
            if(i < this.animationStatus.animationStep){
                this.steps[i].call(this);
            } else {
                this.steps[i].call(this, this.animationStatus.animationFrame);
            }
        }
    }

    _getAnimationFrameWeight(){
        return Math.sin(this.animationStatus.animationFrame * (Math.PI / 2) / (this.animationConfig.framesForOneStep - 1));
    }

    _clearField(){
        this.context.clearRect(0, 0, this.width, this.height);
    }

    _drawFloor(frame) {
        const startPoint = {
            x: 5,
            y: this.height - 5
        };
        const endPoint = {
            x: this.width - 5,
            y: this.height - 5
        };

        if(frame !== undefined){
            // animation: draw from the startpoint.x to the endpoint.x
            endPoint.x = startPoint.x + Math.floor((endPoint.x - startPoint.x) * this._getAnimationFrameWeight());
        }

        this._drawLine(startPoint, endPoint);
    }

    _drawPole(frame){
        const startPoint = {
            x: this.width * 3 / 4,
            y: this.height - 5
        };
        const endPoint = {
            x: this.width * 3 / 4,
            y: 10
        };

        if(frame !== undefined){
            // animation: draw from the startpoint.y to the endpoint.y
            endPoint.y = startPoint.y - Math.floor((startPoint.y - endPoint.y) * this._getAnimationFrameWeight());
        }

        this._drawLine(startPoint, endPoint);
    }

    _drawBar(frame){
        const startPoint = {
            x: this.width * 3 / 4 + 10,
            y: 20
        };
        const endPoint = {
            x: this.width / 3,
            y: 20
        };

        if(frame !== undefined){
            // animation: draw from the startpoint.x to the endpoint.x
            endPoint.x = startPoint.x - Math.floor((startPoint.x - endPoint.x) * this._getAnimationFrameWeight());
        }

        this._drawLine(startPoint, endPoint);
    }

    _drawRope(frame){
        const startPoint = {
            x: this.width / 3 + 5,
            y: 20
        };
        const endPoint = {
            x: this.width / 3 + 5,
            y: this.height / 3
        };

        if(frame !== undefined){
            // animation: draw from the startpoint.y to the endpoint.y
            endPoint.y = startPoint.y + Math.floor((endPoint.y - startPoint.y) * this._getAnimationFrameWeight());
        }

        this._drawLine(startPoint, endPoint);
    }

    _drawHead(frame){
        let endAngle = Math.PI * 2 * 3 / 4;

        if(frame !== undefined){
            // animation: circle
            endAngle = endAngle * this._getAnimationFrameWeight();
        }

        this.context.beginPath();
        this.context.arc(this.width / 3 + 5, this.height / 3 + 10, 10, - Math.PI / 2, endAngle);
        this.context.stroke();
    }

    _drawBody(frame){
        const startPoint = {
            x: this.width / 3 + 5,
            y: this.height / 3 + 20
        };
        const endPoint = {
            x: this.width / 3 + 5,
            y: this.height / 3 + 20 + 40
        };

        if(frame !== undefined){
            // animation: startpoint.y to endpoint.y
            endPoint.y = startPoint.y + Math.floor((endPoint.y - startPoint.y) * this._getAnimationFrameWeight());
        }
        this._drawLine(startPoint, endPoint);
    }

    _drawHands(frame){
        const startPoint = {
            x: this.width / 3 - 15,
            y: this.height / 3 + 40
        };
        const endPoint = {
            x: this.width / 3 + 25,
            y: this.height / 3 + 40
        };

        if(frame !== undefined){
            // animation: startpoint.x to endpoint.x
            endPoint.x = startPoint.x + Math.floor((endPoint.x - startPoint.x) * this._getAnimationFrameWeight());
        }
        this._drawLine(startPoint, endPoint);
    }

    _drawFeet(frame){
        const startPoint = {
            x: this.width / 3 - 15,
            y: this.height / 3 + 80
        }
        const middlePoint = {
            x: this.width / 3 + 5,
            y: this.height / 3 + 60
        }
        const endPoint = {
            x: this.width / 3 + 25,
            y: this.height / 3 + 80
        }

        if(frame !== undefined){

            let animationFrameWeightSpecial = frame / (this.animationConfig.framesForOneStep / 2 - 1);
            if(animationFrameWeightSpecial > 1){
                animationFrameWeightSpecial -= 1;
            }

            if(frame < this.animationConfig.framesForOneStep / 2){
                // animation: animate left feet
                middlePoint.x = startPoint.x + Math.floor((middlePoint.x - startPoint.x) * animationFrameWeightSpecial);
                middlePoint.y = startPoint.y - Math.floor((startPoint.y - middlePoint.y) * animationFrameWeightSpecial);

                this._drawLine(startPoint, middlePoint);
            } else {
                // animation: draw left feet and animate right feet
                endPoint.x = middlePoint.x + Math.floor((endPoint.x - middlePoint.x) * animationFrameWeightSpecial);
                endPoint.y = middlePoint.y + Math.floor((endPoint.y - middlePoint.y) * animationFrameWeightSpecial);

                this._drawLine(startPoint, middlePoint);
                this._drawLine(middlePoint, endPoint);
            }
        } else {
            this._drawLine(startPoint, middlePoint);
            this._drawLine(middlePoint, endPoint);
        }
    }

    _drawLine(startPoint, endPoint){
        this.context.beginPath();
        this.context.moveTo(startPoint.x, startPoint.y);
        this.context.lineTo(endPoint.x, endPoint.y);
        this.context.stroke();
    }
}
