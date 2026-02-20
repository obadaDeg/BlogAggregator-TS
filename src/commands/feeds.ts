import { getFeeds } from "../lib/db/queries/feeds.js";

export async function handlerFeeds(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const feeds = await getFeeds();
  for (const feed of feeds) {
    console.log(`Name: ${feed.name}`);
    console.log(`URL:  ${feed.url}`);
    console.log(`User: ${feed.userName}`);
    console.log("---");
  }
}
