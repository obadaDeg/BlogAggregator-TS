import { readConfig } from "../config.js";
import { users } from "../lib/db/schema.js";
import { getUserByName } from "../lib/db/queries/users.js";

export type User = typeof users.$inferSelect;

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  // TODO: read config, look up user by currentUserName, throw if not found,
  // then call handler(cmdName, user, ...args)
  return async (cmdName: string, ...args: string[]) => {
    const cfg = readConfig();
    if (!cfg.currentUserName) {
      throw new Error("No user logged in");
    }
    const user = await getUserByName(cfg.currentUserName);
    if (!user) {
      throw new Error(`User ${cfg.currentUserName} does not exist`);
    }
    await handler(cmdName, user, ...args);
  };
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}
