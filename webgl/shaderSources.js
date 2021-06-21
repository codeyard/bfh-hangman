/*
 Shader Sources
 written in GLSL Language
 attributes are inputs
 varying are variables shared between the shaders
 uniform are constants shared between the shaders

 vec3/vec4 is the type -> vector with number of values
 mat4 -> matrix -> 4x4 -> used for transformations
 */

export const vsSource = `
    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    uniform mat4 uWorldMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying vec3 fragColor;

    void main() {
      fragColor = vertColor;
      gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(vertPosition, 1.0);
    }
  `;

export const fsSource = `
    precision mediump float;
    varying vec3 fragColor;
    void main() {
      gl_FragColor = vec4(fragColor, 1.0);
    }
  `;