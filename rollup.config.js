import { uglify } from 'rollup-plugin-uglify';
import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import tsconfig from './src/tsconfig.json';
import pkg from './package.json';

delete tsconfig.compilerOptions.declaration;
delete tsconfig.compilerOptions.declarationDir;
delete tsconfig.compilerOptions.outDir;

const banner = `
/*!
 * affutil ${pkg.version} (${pkg.homepage})
 * Copyright 2022-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

export default [
  // 编译测 ES6 模块化文件
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'affutil',
      banner,
      sourcemap: true,
      format: 'es',
      file: './dist/affutil.esm.js',
    },
    plugins: [
      optimizeLodashImports(),
      resolve(),
      typescript(tsconfig.compilerOptions)
    ],
  },
  {
    input: './src/index.ts',
    output: {
      format: 'es',
      file: './dist/affutil.esm.d.ts',
    },
    plugins: [dts()],
  },

  // 编译成 umd 文件
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'affutil',
      banner,
      sourcemap: true,
      format: 'umd',
      file: './dist/affutil.js',
    },
    plugins: [
      optimizeLodashImports(),
      resolve(),
      typescript(tsconfig.compilerOptions),
      buble(),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      format: 'es',
      file: './dist/affutil.d.ts',
    },
    plugins: [dts()],
  },

  // 编译成 umd 文件，并压缩
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'affutil',
      banner,
      sourcemap: true,
      format: 'umd',
      file: './dist/affutil.min.js',
    },
    plugins: [
      optimizeLodashImports(),
      resolve(),
      typescript(tsconfig.compilerOptions),
      buble(),
      uglify({
        mangle: false,
        output: {
          preamble: banner,
        },
      }),
    ],
  },
];
