import type { Config } from "prismic-ts-codegen";

// ⚠️ IMPORTANT: DO NOT USE prismic-ts-codegen
// This project uses the OFFICIAL Prismic approach with Slice Machine
// Types are auto-generated in prismicio-types.d.ts by @slicemachine/adapter-next
// 
// Using prismic-ts-codegen causes type conflicts and is NOT the Prismic standard
// See: https://github.com/prismicio-community/nextjs-starter-prismic-minimal
//
// This file is kept only to prevent accidental usage

const config: Config = {
  output: "./types.generated.ts", // ⚠️ DO NOT GENERATE - CAUSES CONFLICTS
  models: ["./customtypes/**/index.json", "./src/cms/slices/**/model.json"],
};

export default config;