import { setUser } from "../config.js";
import { getUserByName } from "../lib/db/queries/users.js";

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
