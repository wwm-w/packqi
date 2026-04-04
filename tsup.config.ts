import { defineConfig } from "tsup";

export default defineConfig({
  outExtension({ format }) {
    return {
      js: `.js`,
    };
  },
  entry: ["src/ts/citizen.ts", "src/ts/common.ts"],
  format: ["iife"],
  target: "chrome120",
  platform: "browser",
  esbuildOptions(options) {
    options.legalComments = "inline";
    // Confirmed MW linter kills — each one verified by a parse error in testing:
    //   #x  private fields/methods  → WeakMap helpers       (round 1)
    //   ??  nullish coalescing      → ternary               (round 2)
    //   ?.  optional chaining       → &&-chain              (round 2)
    //   x;  public class fields     → constructor assign    (round 3)
    options.supported = {
      "class-private-field": false,
      "class-private-method": false,
      "class-private-accessor": false,
      "nullish-coalescing": false,
      "optional-chain": false,
      "class-field": false,
    };
  },

  external: ["mediawiki", "jquery", "oojs"],

  treeshake: true,
  minify: false,
  sourcemap: false,
  shims: false,
  dts: false,

  outDir: "dist",
  clean: true,
});
