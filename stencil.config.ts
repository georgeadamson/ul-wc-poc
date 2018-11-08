import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "iea-wc",
  globalStyle: "src/global/global.scss",
  outputTargets: [
    {
      type: "dist"
      // resourcesUrl: "https://unpkg.com/iea-poc@0.0.8/dist/iea-wc"
    },
    {
      type: "www",
      serviceWorker: null
    }
  ],
  plugins: [sass()]
};
