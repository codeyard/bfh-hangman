import * as glMatrix from './lib/common.js';
import * as mat4 from './lib/mat4.js';
import * as util from "./lib/util.js";
import {fsSource, vsSource} from "./shaderSources.js";

main();

function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    const xu = canvas.clientHeight / 2;
    const yu = canvas.clientWidth / 2;

    // Nur fortfahren, wenn WebGL verfügbar ist und funktioniert
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    gl.clearColor(0.3, 0.7, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);

    /*
     Create and Compile shaders
     */
    const vertexShader = createAndCompileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createAndCompileShader(fsSource, gl.FRAGMENT_SHADER);
    /*
    Link Program
     */
    const program = createAndLinkProgram(vertexShader, fragmentShader);

    /*
    Create Buffer from Data (last bound BUffer is the one that is used!)
    The data needs to go from CPU RAM-Memory to GPU Buffers
     */

    /*
       V5------V4
     / |      /|
    V1------V0 |
    | |V6---|--V7
    |/      | /
    V2------V3
     */

    let cubeVertexes =
        [ // X, Y, Z           R, G, B
            // Top
            -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
            1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
            1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

            // Left
            -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

            // Right
            1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
            1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
            1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
            1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

            // Front
            1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
            1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

            // Back
            1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
            1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

            // Bottom
            -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
            1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
            1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
        ];

    var cubeIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];


    let cubeVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexes), gl.STATIC_DRAW);

    let cubeIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW)

    /*
    Get Attribute Haldles
    Attributes are the "parameters" for the GLSL programs we need a reference to these input params
     */
    let positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');

    /* Get Uniform Handels
     */
    let positionUniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
    let positionUniformViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
    let positionUniformProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');

    gl.useProgram(program);

    let emptyArray = new Float32Array(16);
    let identityMatrix = mat4.identity(emptyArray);
    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projectionMatrix = new Float32Array(16);

    mat4.rotate(worldMatrix, identityMatrix, Math.PI * 1.3, [0,1,0]);
    mat4.lookAt(viewMatrix, [1,2,-4], [0,0,0], [0,1,0]);
    mat4.perspective(projectionMatrix, Math.PI / 2, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

    gl.uniformMatrix4fv(positionUniformWorldMatrix, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(positionUniformViewMatrix, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(positionUniformProjectionMatrix, gl.FALSE, projectionMatrix);

    /*
     Specify attribute Layout
     how does the Graphics card need to read the data
     */
    gl.vertexAttribPointer(
        positionAttributeLocation, // Attribute Location
        3, // Number of elements each attribute has (X,Y,Z)
        gl.FLOAT, // Type of elements
        gl.FALSE, // Is
        6 * Float32Array.BYTES_PER_ELEMENT, // Sitze of a vertex
        0// Offset of the beginning of vertex
    )

    gl.vertexAttribPointer(
        colorAttributeLocation, // Attribute Location
        3, // Number of elements each attribute has (R,G,B)
        gl.FLOAT, // Type of elements
        gl.FALSE, // Is
        6 * Float32Array.BYTES_PER_ELEMENT, // Sitze of a vertex
        3 * Float32Array.BYTES_PER_ELEMENT// Offset of the beginning of vertex
    )

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    let worldYInput = document.querySelector('#worldYInput');
    let worldXInput = document.querySelector('#worldXInput');
    let worldZInput = document.querySelector('#worldZInput');

    let ViewPosX = document.querySelector('#ViewPosX');
    let ViewPosY = document.querySelector('#ViewPosY');
    let ViewPosZ = document.querySelector('#ViewPosZ');


    let renderLoop = function() {
        gl.clearColor(0.3, 0.7, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let worldY = worldYInput.value;
        let worldX = worldXInput.value;
        let worldZ = worldZInput.value;

        let viewX = ViewPosX.value;
        let viewY = ViewPosY.value;
        let viewZ = ViewPosZ.value;

        mat4.rotate(worldMatrix, identityMatrix, Math.PI * worldY, [0,1,0]);
        mat4.rotate(worldMatrix, worldMatrix, Math.PI * worldX, [1,0,0]);
        mat4.rotate(worldMatrix, worldMatrix, Math.PI * worldZ, [0,0,1]);
        mat4.lookAt(viewMatrix, [viewX,viewY,viewZ], [0,0,0], [0,1,0]);
        mat4.perspective(projectionMatrix, Math.PI/ 2, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

        gl.uniformMatrix4fv(positionUniformWorldMatrix, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(positionUniformViewMatrix, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(positionUniformProjectionMatrix, gl.FALSE, projectionMatrix);

        gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
        window.requestAnimationFrame(() => renderLoop());
    }

    window.requestAnimationFrame(() => renderLoop());

    /*
    Prvt functions
     */


    function createAndCompileShader(shaderSource, shaderType) {
        // Create and Compile shaders
        const shader = gl.createShader(shaderType);


        gl.shaderSource(shader, shaderSource);

        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('ERROR Compiling shader', gl.getShaderInfoLog(shader));
            throw {message: 'ERROR Compiling shader' + gl.getShaderInfoLog(shader)};
        }

        return shader;
    }

    function createAndLinkProgram(vsShader, fsShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);

        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR Linking program', gl.getProgramInfoLog(program));
            throw {message: 'ERROR Linking program' + gl.getProgramInfoLog(program)};
        }
        return program;
    }

    function createIdentityMatrix() {
        return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    }

    function createScaleMatrix(scale) {
        return new Float32Array([scale,-0.5,0,0,0.5,scale,0,0,0,0,1,0,0,0,0,1]);
    }

}