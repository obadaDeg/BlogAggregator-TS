import { fetchFeed } from "../api/rss.js";
import { getNextFeedToFetch, markFeedAsFetched } from "../lib/db/queries/feeds.js";

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error(`Invalid duration format: "${durationStr}". Use formats like 1s, 1m, 1h, 500ms`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "ms": return value;
    case "s":  return value * 1000;
    case "m":  return value * 60 * 1000;
    case "h":  return value * 60 * 60 * 1000;
    default:   throw new Error(`Unknown unit: ${unit}`);
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h${minutes}m${seconds}s`;
  if (minutes > 0) return `${minutes}m${seconds}s`;
  return `${seconds}s`;
}

function handleError(err: unknown): void {
  console.error(`Error: ${(err as Error).message}`);
}

async function scrapeFeeds(): Promise<void> {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch.");
    return;
  }

  console.log(`Fetching feed: ${feed.name} (${feed.url})`);
  await markFeedAsFetched(feed.id);

  const rssFeed = await fetchFeed(feed.url);
  for (const item of rssFeed.channel.item) {
    console.log(` - ${item.title}`);
  }
}

export async function handlerAgg(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length < 1) {
    throw new Error("Usage: agg <time_between_reqs> (e.g. 1s, 30s, 1m)");
  }

  const timeBetweenRequests = parseDuration(args[0]);
  console.log(`Collecting feeds every ${formatDuration(timeBetweenRequests)}`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}
