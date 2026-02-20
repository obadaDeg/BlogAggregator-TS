import { desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { posts, feeds, feedFollows } from "../schema.js";

export type Post = typeof posts.$inferSelect;

export async function createPost(
  title: string,
  url: string,
  feedId: string,
  description?: string,
  publishedAt?: Date,
) {
  const [result] = await db
    .insert(posts)
    .values({ title, url, feedId, description, publishedAt })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getPostsForUser(userId: string, limit: number = 2) {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}
