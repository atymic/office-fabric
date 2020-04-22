import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

import path from 'path'

import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
// @ts-ignore
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const packageRoot = path.resolve(__dirname)

const extensions = ['.js', '.jsx', '.json', '.ts', '.tsx', '.vue']

export default {
  // external: [
  //   /id/,
  //   'id2',
  // ],
  input: './src/index.ts',
  output: {
    dir: path.resolve('lib'),
    format: 'esm',
    sourcemap: false,
  },
  external: [
    ...Object.keys(pkg.dependencies),
    '@microsoft/load-themed-styles',
    '@uifabric/set-version',
  ],
  preserveModules: true,
  preserveSymlinks: true,
  plugins: [
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    alias({
      resolve: extensions,
      entries: [
        { find: /^@\/(.*)/, replacement: path.resolve(packageRoot, 'src/$1') },
        { find: '@uifabric/utilities', replacement: '@uifabric-vue/utilities' },
      ],
    }),
    vue({
      css: false,
    }),
    typescript({
      abortOnError: false,
      typescript: require('typescript'),
      useTsconfigDeclarationDir: true,
      check: false,
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
        },
      },
    }),
    resolve({
      extensions: extensions,
      preferBuiltins: true,
    }),
    commonjs({ include: /node_modules/ }),
    babel({
      exclude: /node_modules/,
      extensions: extensions,
      babelrc: false,
      configFile: false,
      presets: [
        ['@vue/cli-plugin-babel/preset', {
          modules: false,
          useBuiltIns: false,
          polyfills: [],
        }],
      ],
    }),
  ],
}
