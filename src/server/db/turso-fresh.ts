import { db } from "./index";
import { sql } from "drizzle-orm";

await db.run(sql`DROP TABLE IF EXISTS account`);
await db.run(sql`DROP TABLE IF EXISTS session`);
await db.run(sql`DROP TABLE IF EXISTS verification_token`);
await db.run(sql`DROP TABLE IF EXISTS user`);