import { getPostsForUser } from "../lib/db/queries/posts.js";
import { User, UserCommandHandler } from "./index.js";

export const handlerBrowse: UserCommandHandler = async (
  _cmdName: string,
  user: User,
  ...args: string[]
) => {
  const limit = args[0] ? parseInt(args[0], 10) : 2;
  if (isNaN(limit) || limit < 1) {
    throw new Error("limit must be a positive number");
  }

  const userPosts = await getPostsForUser(user.id, limit);
  if (userPosts.length === 0) {
    console.log("No posts found. Try running `agg` first to fetch feeds.");
    return;
  }

  for (const post of userPosts) {
    console.log(`--- ${post.feedName} ---`);
    console.log(`Title:       ${post.title}`);
    console.log(`URL:         ${post.url}`);
    if (post.publishedAt) {
      console.log(`Published:   ${post.publishedAt.toLocaleString()}`);
    }
    if (post.description) {
      console.log(`Description: ${post.description.slice(0, 100)}...`);
    }
    console.log("");
  }
};
