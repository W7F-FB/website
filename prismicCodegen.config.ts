import type { Config } from "prismic-ts-codegen";

const config: Config = {
  output: "./types.generated.ts",
  models: ["./customtypes/**/index.json", "./src/cms/slices/**/model.json"],
};

export default config;