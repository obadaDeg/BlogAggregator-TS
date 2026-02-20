import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, users, feedFollows } from "../schema.js";

export type Feed = typeof feeds.$inferSelect;

export async function getFeeds() {
  return db
    .select({
      id: feeds.id,
      name: feeds.name,
      url: feeds.url,
      createdAt: feeds.createdAt,
      updatedAt: feeds.updatedAt,
      userId: feeds.userId,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
}

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}

export async function createFeedFollow(feedId: string, userId: string) {
  const [result] = await db
    .insert(feedFollows)
    .values({ feedId, userId })
    .returning();

  const additionalInfo = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, result.id))
    .limit(1);
  return { ...result, ...additionalInfo[0] };
}


export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getFeedFollowsByUser(userId: string) {
  const results = await db
    .select({
      feedId: feedFollows.feedId,
      feedName: feeds.name,
      feedUrl: feeds.url,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
  return results;
}