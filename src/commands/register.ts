import { setUser } from "../config.js";
import { createUser, getUserByName } from "../lib/db/queries/users.js";

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
