import { readConfig, setUser } from "./config.js";

function main() {
  setUser("Obada");
  const cfg = readConfig();
  console.log(cfg);
}

main();
