import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Example table - modify or add more as needed
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Add more tables here as your project grows
// export const users = sqliteTable("users", { ... });
