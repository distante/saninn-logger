import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/@saninn__logger.ts',

  output: {
    banner: `/**
 *  @license
 *
 *  Copyright Saninn Salas Diaz All Rights Reserved.
 *
 *  Released under the MIT License
 *
 *  http://www.saninnsalas.com
 */`,
    file: './dist/iife/@saninn__logger.js',
    format: 'iife',
    name: 'SaninnLogger'
  },
  plugins: [
    typescript({
      // lib: ["es5", "es6", "dom"],
      sourceMap: false,
      target: 'es3'
    })
  ]
};
