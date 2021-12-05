import { DenonConfig } from "https://deno.land/x/denon/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run server.ts",
      desc: "Run the main server.",
      allow: [
        "env",
        "net",
        "plugin",
        "read",
        "write"
      ],
      unstable: true,
      env: env(),
    },
    test: {
      cmd: "deno test tests/",
      desc: "Run test.",
      allow: [
        "env",
        "net",
        "plugin",
        "read",
        "write"
      ],
      unstable: true,
      env: env(),
    },
  },
};

export default config;
