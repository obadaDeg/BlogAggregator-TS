import { setUser } from "./config.js";
import {
  createUser,
  getAllUsers,
  getUserByName,
  resetUsers,
} from "./lib/db/queries/users.js";
import { readConfig } from "./config.js";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("Missing user name");
  }

  const username = args[0];
  const user = await getUserByName(username);
  if (!user) {
    throw new Error(`User ${username} does not exist`);
  }
  const cfg = setUser(username);
  console.log(`Logged in as ${cfg.currentUserName}`);
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
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

export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("Missing user name");
  }

  const username = args[0];
  const existingUser = await getUserByName(username);

  if (existingUser) {
    throw new Error(`User ${username} already exists`);
  }

  const newUser = await createUser(username);
  setUser(newUser.name);

  console.log(`Registered and logged in as ${newUser.name}`);
}

export async function handlerReset(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  await resetUsers();
  console.log("All users have been reset");
}

export async function getAllUsersHandler(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const users = await getAllUsers();
  const cfg = readConfig();
  users.forEach((user) => {
    const suffix = user.name === cfg.currentUserName ? " (current)" : "";
    console.log(`* ${user.name}${suffix}`);
  });
}
