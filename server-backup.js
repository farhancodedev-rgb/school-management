const http = require("http");
const fs = require("fs");
const initSqlJs = require("sql.js");

let db;

async function startServer() {
    const SQL = await initSqlJs();

    if (fs.existsSync("school.db")) {
        const data = fs.readFileSync("school.db");
        db = new SQL.Database(data);
    } else {
        db = new SQL.Database();
    }

    // STUDENTS
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            father TEXT NOT NULL,
            className TEXT NOT NULL,
            roll TEXT NOT NULL
        )
    `);

    // TEACHERS
    db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            father TEXT NOT NULL,
            subject TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);

    // ATTENDANCE
    db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL
        )
    `);

    // FEES
    db.run(`
        CREATE TABLE IF NOT EXISTS fees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            totalFees REAL NOT NULL,
            paidAmount REAL NOT NULL,
            remaining REAL NOT NULL,
            paymentDate TEXT NOT NULL
        )
    `);
        // =========================
        // PAGES
        // =========================
    const server = http.createServer((req, res) => {

           if (req.method === "GET" && req.url === "/teachers.html") {
            return sendFile(
                res,
                "./public/teachers.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/attendance.html") {
            return sendFile(
                res,
                "./public/attendance.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/fees.html") {
            return sendFile(
                res,
                "./public/fees.html",
                "text/html"
            );
        }

if (req.method === "GET" && req.url === "/classes.html") {
    return sendFile(
        res,
        "./public/classes.html",
        "text/html"
    );
}
        if (req.method === "GET" && req.url === "/style.css") {
            return sendFile(
                res,
                "./public/style.css",
                "text/css"
            );
        }

        // =========================
        // STUDENTS
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/api/students"
        ) {
            const result = db.exec(
                "SELECT * FROM students"
            );

            return sendJSON(res, result);
        }

        if (
            req.method === "POST" &&
            req.url === "/api/students"
        ) {
            return readBody(req, (student) => {

                db.run(
                    `INSERT INTO students
                    (name, father, className, roll)
                    VALUES (?, ?, ?, ?)`,
                    [
                        student.name,
                        student.father,
                        student.className,
                        student.roll
                    ]
                );

                saveDatabase();

                sendJSON(res, {
                    message: "Student added"
                });
            });
        }

        if (
            req.method === "DELETE" &&
            req.url.startsWith("/api/students/")
        ) {
            const id = req.url.split("/").pop();

            db.run(
                "DELETE FROM students WHERE id = ?",
                [id]
            );

            saveDatabase();

            return sendJSON(res, {
                message: "Student deleted"
            });
        }

        if (
            req.method === "PUT" &&
            req.url.startsWith("/api/students/")
        ) {
            const id = req.url.split("/").pop();

            return readBody(req, (student) => {

                db.run(
                    `UPDATE students
                     SET name = ?,
                         father = ?,
                         className = ?,
                         roll = ?
                     WHERE id = ?`,
                    [
                        student.name,
                        student.father,
                        student.className,
                        student.roll,
                        id
                    ]
                );

                saveDatabase();

                sendJSON(res, {
                    message: "Student updated"
                });
            });
        }

        // =========================
        // TEACHERS
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/api/teachers"
        ) {
            const result = db.exec(
                "SELECT * FROM teachers"
            );

            return sendJSON(res, result);
        }

        if (
            req.method === "POST" &&
            req.url === "/api/teachers"
        ) {
            return readBody(req, (teacher) => {

                db.run(
                    `INSERT INTO teachers
                    (name, father, subject, phone)
                    VALUES (?, ?, ?, ?)`,
                    [
                        teacher.name,
                        teacher.father,
                        teacher.subject,
                        teacher.phone
                    ]
                );

                saveDatabase();

                sendJSON(res, {
                    message: "Teacher added"
                });
            });
        }

        if (
            req.method === "DELETE" &&
            req.url.startsWith("/api/teachers/")
        ) {
            const id = req.url.split("/").pop();

            db.run(
                "DELETE FROM teachers WHERE id = ?",
                [id]
            );

            saveDatabase();

            return sendJSON(res, {
                message: "Teacher deleted"
            });
        }

// =========================
// CLASSES
// =========================

if (
    req.method === "GET" &&
    req.url === "/api/classes"
) {
    const result = db.exec(
        "SELECT * FROM classes ORDER BY id DESC"
    );

    return sendJSON(res, result);
}

if (
    req.method === "POST" &&
    req.url === "/api/classes"
) {
    return readBody(req, (classData) => {

        db.run(
            `INSERT INTO classes
            (className, section)
            VALUES (?, ?)`,
            [
                classData.className,
                classData.section
            ]
        );

        saveDatabase();

        sendJSON(res, {
            message: "Class added"
        });
    });
}

if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/classes/")
) {
    const id = req.url.split("/").pop();

    db.run(
        "DELETE FROM classes WHERE id = ?",
        [id]
    );

    saveDatabase();

    return sendJSON(res, {
        message: "Class deleted"
    });
}
// =========================
// CLASSES
// =========================

if (
    req.method === "GET" &&
    req.url === "/api/classes"
) {
    const result = db.exec(
        "SELECT * FROM classes ORDER BY id DESC"
    );

    return sendJSON(res, result);
}

if (
    req.method === "POST" &&
    req.url === "/api/classes"
) {
    return readBody(req, (classData) => {

        db.run(
            `INSERT INTO classes
            (className, section)
            VALUES (?, ?)`,
            [
                classData.className,
                classData.section
            ]
        );

        saveDatabase();

        sendJSON(res, {
            message: "Class added"
        });
    });
}

if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/classes/")
) {
    const id = req.url.split("/").pop();

    db.run(
        "DELETE FROM classes WHERE id = ?",
        [id]
    );

    saveDatabase();

    return sendJSON(res, {
        message: "Class deleted"
    });
}

// =========================
// LOGIN
// =========================

if (
    req.method === "POST" &&
    req.url === "/api/login"
) {
    return readBody(req, (login) => {

        const correctUsername = "admin";
        const correctPassword = "1234";

        if (
            login.username === correctUsername &&
            login.password === correctPassword
        ) {

            sendJSON(res, {
                success: true
            });

        } else {

            sendJSON(res, {
                success: false
            });
        }
    });
}
        // =========================
        // ATTENDANCE
        // =========================

        if (
            req.method === "POST" &&
            req.url === "/api/attendance"
        ) {
            return readBody(req, (attendance) => {

                db.run(
                    `INSERT INTO attendance
                    (studentId, date, status)
                    VALUES (?, ?, ?)`,
                    [
                        attendance.studentId,
                        attendance.date,
                        attendance.status
                    ]
                );

                saveDatabase();

                sendJSON(res, {
                    message: "Attendance saved"
                });
            });
        }

        // =========================
        // FEES
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/api/fees"
        ) {

            const result = db.exec(`
                SELECT
                    fees.id,
                    students.name AS studentName,
                    fees.totalFees,
                    fees.paidAmount,
                    fees.remaining,
                    fees.paymentDate
                FROM fees
                JOIN students
                ON fees.studentId = students.id
                ORDER BY fees.id DESC
            `);

            return sendJSON(res, result);
        }

        if (
            req.method === "POST" &&
            req.url === "/api/fees"
        ) {

            return readBody(req, (fee) => {

                db.run(
                    `INSERT INTO fees
                    (
                        studentId,
                        totalFees,
                        paidAmount,
                        remaining,
                        paymentDate
                    )
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        fee.studentId,
                        fee.totalFees,
                        fee.paidAmount,
                        fee.remaining,
                        fee.paymentDate
                    ]
                );

                saveDatabase();

                sendJSON(res, {
                    message: "Fee payment saved"
                });
            });
        }

    server.listen(3000, () => {
        console.log(
            "School website running at http://localhost:3000"
        );
    });
}


// SAVE DATABASE

function saveDatabase() {

    const data = db.export();

    fs.writeFileSync(
        "school.db",
        Buffer.from(data)
    );
}


// READ BODY

function readBody(req, callback) {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        try {

            const data = JSON.parse(body);

            callback(data);

        } catch (error) {

            console.log(
                "Invalid JSON:",
                error.message
            );
        }
    });
}


// SEND JSON

function sendJSON(res, data) {

    let output = data;

    if (
        Array.isArray(data) === true &&
        data.length > 0 &&
        data[0].columns
    ) {

        const columns = data[0].columns;
        const values = data[0].values;

        output = values.map(row => {

            const item = {};

            columns.forEach((column, index) => {
                item[column] = row[index];
            });

            return item;
        });
    }

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(output));
}


// SEND FILE

function sendFile(res, file, type) {

    fs.readFile(file, (err, data) => {

        if (err) {
            res.writeHead(404);
            return res.end("File not found");
        }

       res.writeHead(200, {
    "Content-Type": type + "; charset=utf-8"
});
        res.end(data);
    });
}


startServer();
