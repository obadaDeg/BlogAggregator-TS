import { readConfig } from "../config.js";
import { createFeed, Feed } from "../lib/db/queries/feeds.js";
import { getUserByName } from "../lib/db/queries/users.js";
import { users } from "../lib/db/schema.js";

type User = typeof users.$inferSelect;

function printFeed(feed: Feed, user: User): void {
  console.log(`ID:         ${feed.id}`);
  console.log(`Name:       ${feed.name}`);
  console.log(`URL:        ${feed.url}`);
  console.log(`User:       ${user.name}`);
  console.log(`Created At: ${feed.createdAt}`);
  console.log(`Updated At: ${feed.updatedAt}`);
}

export async function handlerAddFeed(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length < 2) {
    throw new Error("Usage: addfeed <name> <url>");
  }

  const [name, url] = args;
  const cfg = readConfig();

  if (!cfg.currentUserName) {
    throw new Error("No user logged in");
  }

  const user = await getUserByName(cfg.currentUserName);
  if (!user) {
    throw new Error(`User ${cfg.currentUserName} does not exist`);
  }

  const feed = await createFeed(name, url, user.id);
  printFeed(feed, user);
}
