import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = {
  // TODO: define the shape — keys are command names, values are CommandHandler functions
  [cmdName: string]: CommandHandler;
};

export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (args.length === 0) {
    throw new Error("Missing user name");
  }

  const username = args[0];
  const cfg = setUser(username);
  console.log(`Logged in as ${cfg.currentUserName}`);  
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void {
  // TODO: add the handler to the registry under the given command name
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): void {
  // TODO: look up the command in the registry, throw if not found, otherwise call it
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  handler(cmdName, ...args);
}
