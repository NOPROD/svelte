import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;
const onwarn = (warning, onwarn) => {
  if (
    warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)
  ) {
    return;
  }

  if (warning.code === "THIS_IS_UNDEFINED") {
    return;
  }

  onwarn(warning);
};
const dedupe = (importee) =>
  importee === "svelte" || importee.startsWith("svelte/");
const postcssOptions = () => ({
  extensions: [".scss", ".sass"],
  extract: false,
  minimize: true,
  use: [
    [
      "sass",
      {
        includePaths: [
          "./src/theme",
          "./node_modules",
          // This is only needed because we're using a local module. :-/
          // Normally, you would not need this line.
          path.resolve(__dirname, "..", "node_modules"),
        ],
      },
    ],
  ],
});

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      dev,
      hydratable: true,
      emitCss: false,
      css: true,
    }),
    resolve({
      browser: true,
      dedupe,
    }),
    commonjs(),

    postcss(postcssOptions()),

    legacy &&
      babel({
        extensions: [".js", ".mjs", ".html", ".svelte"],
        runtimeHelpers: true,
        exclude: ["node_modules/@babel/**"],
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "> 0.25%, not dead",
            },
          ],
        ],
        plugins: [],
      }),

    !dev &&
      terser({
        module: true,
      }),
  ],

  onwarn,
};
