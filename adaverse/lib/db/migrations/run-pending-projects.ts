import db from "../index";
import { readFileSync } from "fs";
import { join } from "path";
import { sql } from "drizzle-orm";

async function runMigration() {
    const sqlContent = readFileSync(join(__dirname, '004_create_pending_projects.sql'), "utf-8");
    await db.execute(sql.raw(sqlContent));
    console.log('✅ Migration 004_create_pending_projects.sql executed successfully!');
}

runMigration().catch(console.error);
