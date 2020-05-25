import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

const production = !process.env.ROLLUP_WATCH;

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
      css: (css) => {
        css.write("public/build/bundle.css");
      },
    }),

    resolve({
      browser: true,
      dedupe: (importee) =>
        importee === "svelte" || importee.startsWith("svelte/"),
    }),
    commonjs(),
    postcss({
      extensions: [".scss", ".sass"],
      extract: "public/build/material.css",
      minimize: true,
      use: [
        [
          "sass",
          {
            includePaths: ["./src", "./node_modules"],
          },
        ],
      ],
    }),

    !production && serve(),

    !production && livereload("public"),

    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
  onwarn,
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
