import { deleteFeedFollow } from "../lib/db/queries/feeds.js";
import { User, UserCommandHandler } from "./index.js";

export const handlerUnfollow: UserCommandHandler = async (
  _cmdName,
  user: User,
  ...args
) => {
  if (args.length < 1) {
    throw new Error("Usage: unfollow <url>");
  }

  const url = args[0];
  await deleteFeedFollow(user.id, url);
  console.log(`Unfollowed feed: ${url}`);
};
