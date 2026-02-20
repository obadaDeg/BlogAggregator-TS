import { handlerLogin } from "./commands/login.js";
import { handlerRegister } from "./commands/register.js";
import { handlerReset } from "./commands/reset.js";
import { handlerUsers } from "./commands/users.js";
import { handlerAgg } from "./commands/agg.js";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/index.js";

async function main() {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("No command provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
  process.exit(0);
}

main();
