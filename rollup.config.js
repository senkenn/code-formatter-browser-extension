import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "src/background.ts",
    output: {
      file: "dist/background.js",
      format: "iife",
      name: "Background",
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      copy({
        targets: [
          { src: "manifest.json", dest: "dist" },
          { src: "src/popup/popup.html", dest: "dist" },
          { src: "src/popup/popup.css", dest: "dist" },
        ],
      }),
    ],
  },
  {
    input: "src/content.ts",
    output: {
      file: "dist/content.js",
      format: "iife",
      name: "Content",
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
  },
  {
    input: "src/popup/popup.ts",
    output: {
      file: "dist/popup.js",
      format: "iife",
      name: "Popup",
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
  },
];
