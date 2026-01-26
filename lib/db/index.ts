import Database from "better-sqlite3";

// SQLite database stored locally in the project
const db = new Database("local.db");

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Helper to run a query and return all rows
export function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): T[] {
  return db.prepare(sql).all(...params) as T[];
}

// Helper to run a query and return the first row
export function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): T | undefined {
  return db.prepare(sql).get(...params) as T | undefined;
}

// Helper to run an insert/update/delete and return { changes, lastInsertRowid }
export function run(sql: string, params: unknown[] = []) {
  return db.prepare(sql).run(...params);
}

// Helper to execute raw SQL (for CREATE TABLE, etc.)
export function exec(sql: string) {
  return db.exec(sql);
}

// Export the raw db instance if needed for transactions, etc.
export { db };
