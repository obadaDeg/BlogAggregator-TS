import { getFeedFollowsByUser } from "../lib/db/queries/feeds.js";
import { User } from "./index.js";

export async function handlerFollowing(
  _cmdName: string,
  user: User,
  ..._args: string[]
): Promise<void> {
  const follows = await getFeedFollowsByUser(user.id);
  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
}
