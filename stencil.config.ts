import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "iea-wc",
  globalStyle: "src/global/global.scss",
  // For some readon dest defaults to dist/collection folder:
  copy: [{ src: "index.html", dest: "../magnum.html" }],
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
