import type { Config } from "prismic-ts-codegen";

// Note: Using Slice Machine generated types (prismicio-types.d.ts) instead
// This config is kept for reference but not actively used to avoid conflicts
const config: Config = {
  output: "./types.generated.ts",
  models: ["./customtypes/**/index.json", "./src/cms/slices/**/model.json"],
};

export default config;