import { createFeed, createFeedFollow, Feed } from "../lib/db/queries/feeds.js";
import { User } from "./index.js";

function printFeed(feed: Feed, user: User): void {
  console.log(`ID:         ${feed.id}`);
  console.log(`Name:       ${feed.name}`);
  console.log(`URL:        ${feed.url}`);
  console.log(`User:       ${user.name}`);
  console.log(`Created At: ${feed.createdAt}`);
  console.log(`Updated At: ${feed.updatedAt}`);
}

export async function handlerAddFeed(
  _cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length < 2) {
    throw new Error("Usage: addfeed <name> <url>");
  }

  const [name, url] = args;

  const feed = await createFeed(name, url, user.id);
  await createFeedFollow(feed.id, user.id);
  printFeed(feed, user);
}
