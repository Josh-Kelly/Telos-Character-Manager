const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./character_db.db"); // This will create a new database file

// Create a table for storing character data
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS characters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, race TEXT, class TEXT, stats TEXT)"
  );
});

module.exports = db;
