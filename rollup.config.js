import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/index.ts',

  output: {
    file: './dist/iife/@saninn__logger.js',
    format: 'iife',
    name: 'SaninnLogger',
    banner: '/** MIT licence */'
  },
  plugins: [
    typescript({
      // lib: ["es5", "es6", "dom"],
      target: 'es5'
    })
  ]
};
