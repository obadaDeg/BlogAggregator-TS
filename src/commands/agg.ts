import { fetchFeed } from "../api/rss.js";

export async function handlerAgg(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(feed);
}
