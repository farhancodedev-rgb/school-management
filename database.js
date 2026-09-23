const initSqlJs = require("sql.js");
const fs = require("fs");

async function createDatabase() {
    const SQL = await initSqlJs();

    const db = new SQL.Database();

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            father TEXT NOT NULL,
            className TEXT NOT NULL,
            roll TEXT NOT NULL
        )
    `);

    const data = db.export();

    fs.writeFileSync("school.db", Buffer.from(data));

    console.log("Database ready!");
}

createDatabase();
