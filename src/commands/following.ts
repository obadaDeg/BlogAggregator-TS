import { readConfig } from "../config.js";
import { getFeedFollowsByUser } from "../lib/db/queries/feeds.js";
import { getUserByName } from "../lib/db/queries/users.js";

export async function handlerFollowing(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const cfg = readConfig();

  if (!cfg.currentUserName) {
    throw new Error("No user logged in");
  }

  const user = await getUserByName(cfg.currentUserName);
  if (!user) {
    throw new Error(`User ${cfg.currentUserName} does not exist`);
  }

  const follows = await getFeedFollowsByUser(user.id);
  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
}
