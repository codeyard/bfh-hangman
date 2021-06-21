export function print4By4Matrix(float32Array) {
    let matrix = float32Array.toString().split(',');
    let printing = [[],[],[],[]];
    for(let row = 0; row < 4; row++) {
        for(let column = 0; column < 4; column++) {
            printing[column][row] = matrix.shift();
        }
    }
    console.log('Matrix 4 by 4:', printing);
}
