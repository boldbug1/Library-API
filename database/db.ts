import Database from 'better-sqlite3';

const db:Database.Database = new Database("library.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL
)
`).run();

export default db;