import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { readConfig } from "src/config.js";
import { feeds, users } from "../schema.js";

export async function createFeed(url: string, feedName: string): Promise<void> {
    const cfg = readConfig();
    if (!cfg.currentUserName) {
        throw new Error("No user logged in");
    }
    const user = await db.select().from(users).where(eq(users.name, cfg.currentUserName)).then(res => res[0]);
    if (!user) {
        throw new Error(`User ${cfg.currentUserName} does not exist`);
    }
    const userId = user.id;
    
    const [result] = await db.insert(feeds).values({ user_id: userId, url: url }).returning();
    console.log(`Feed ${feedName} created with id ${result.id}`);
}

