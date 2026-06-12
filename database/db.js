const Database = require("better-sqlite3");

const db = new Database("library.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL
)
`).run();

module.exports = db;