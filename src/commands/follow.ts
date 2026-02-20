import { readConfig } from "../config.js";
import { createFeedFollow, getFeedByUrl } from "../lib/db/queries/feeds.js";
import { getUserByName } from "../lib/db/queries/users.js";

export async function handlerFollow(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length < 1) {
    throw new Error("Usage: follow <url>");
  }

  const url = args[0];
  const cfg = readConfig();

  if (!cfg.currentUserName) {
    throw new Error("No user logged in");
  }

  const user = await getUserByName(cfg.currentUserName);
  if (!user) {
    throw new Error(`User ${cfg.currentUserName} does not exist`);
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`No feed found with URL: ${url}`);
  }

  try {
    const result = await createFeedFollow(feed.id, user.id);
    console.log(`Following feed: ${result.feedName}`);
    console.log(`User: ${result.userName}`);
  } catch (err: any) {
    if (err?.cause?.code === "23505") {
      throw new Error("You are already following this feed");
    }
    throw err;
  }
}
