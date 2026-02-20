import { resetUsers } from "../lib/db/queries/users.js";

export async function handlerReset(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  await resetUsers();
  console.log("All users have been reset");
}
