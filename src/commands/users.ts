import { readConfig } from "../config.js";
import { getAllUsers } from "../lib/db/queries/users.js";

export async function handlerUsers(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const users = await getAllUsers();
  const cfg = readConfig();
  users.forEach((user) => {
    const suffix = user.name === cfg.currentUserName ? " (current)" : "";
    console.log(`* ${user.name}${suffix}`);
  });
}
