const http = require("http");
const fs = require("fs");
const initSqlJs = require("sql.js");
const path = require("path");
let db;
let sessions = new Set();

async function startServer() {

const SQL = await initSqlJs({
    locateFile: file =>
        path.join(
            __dirname,
            "node_modules/sql.js/dist",
            file
        )
});

    if (fs.existsSync("school.db")) {
        db = new SQL.Database(
            fs.readFileSync("school.db")
        );
    } else {
        db = new SQL.Database();
    }

    // =========================
    // DATABASE TABLES
    // =========================

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            father TEXT NOT NULL,
            className TEXT NOT NULL,
            roll TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            father TEXT NOT NULL,
            subject TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL
        )
    `);

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

    db.run(`
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            className TEXT NOT NULL,
            section TEXT NOT NULL
        )
    `);

      saveDatabase();

    // =========================
    // SERVER
    // =========================

    const server = http.createServer((req, res) => {

        // =========================
        // DASHBOARD API
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/api/dashboard"
        ) {
            const students =
                db.exec("SELECT COUNT(*) AS total FROM students")[0]
                    .values[0][0];

            const teachers =
                db.exec("SELECT COUNT(*) AS total FROM teachers")[0]
                    .values[0][0];

            const classes =
                db.exec("SELECT COUNT(*) AS total FROM classes")[0]
                    .values[0][0];

            const today =
                new Date().toISOString().split("T")[0];

            const attendance =
                db.exec(
                    `SELECT
                        COUNT(*) AS total,
                        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present
                     FROM attendance
                     WHERE date = '${today}'`
                )[0].values[0];

            return sendJSON(res, {
                students,
                teachers,
                classes,
                attendance: {
                    total: attendance[0] || 0,
                    present: attendance[1] || 0
                }
            });
        }


// =========================
// LOGIN PROTECTION
// =========================

function isLoggedIn(req) {

    const cookie = req.headers.cookie || "";

    const match = cookie.match(
        /(?:^|;\s*)session=([^;]+)/
    );

    if (!match) {
        return false;
    }

    return sessions.has(match[1]);
}
        // =========================
        // PAGES
        // =========================

if (
    req.method === "GET" &&
    req.url !== "/login.html" &&
    !isLoggedIn(req)
) {
    res.writeHead(302, {
        "Location": "/login.html"
    });

    return res.end();
} 

       if (req.method === "GET" && req.url === "/") {
            return sendFile(
                res,
                "index.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/login.html") {
            return sendFile(
                res,
                "login.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/students.html") {
            return sendFile(
                res,
                "students.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/teachers.html") {
            return sendFile(
                res,
                "teachers.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/attendance.html") {
            return sendFile(
                res,
                "attendance.html",
                "text/html"
            );
        }

if (
    req.method === "GET" &&
    req.url === "/attendance-report.html"
) {
    return sendFile(
        res,
        "attendance-report.html",
        "text/html"
    );
}
if (
    req.method === "GET" &&
    req.url === "/student-attendance.html"
) {
    return sendFile(
        res,
        "student-attendance.html",
        "text/html"
    );
}

        if (req.method === "GET" && req.url === "/fees.html") {
            return sendFile(
                res,
                "fees.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/classes.html") {
            return sendFile(
                res,
                "classes.html",
                "text/html"
            );
        }

        if (req.method === "GET" && req.url === "/style.css") {
            return sendFile(
                res,
                "style.css",
                "text/css"
            );
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

                    const sessionId =
                        Math.random().toString(36).substring(2) +
                        Date.now().toString(36);

                    sessions.add(sessionId);

                    res.writeHead(200, {
                        "Content-Type":
                            "application/json; charset=utf-8",
                        "Set-Cookie":
                            "session=" +
                            sessionId +
                            "; HttpOnly; Path=/"
                    });

                    return res.end(
                        JSON.stringify({
                            success: true
                        })
                    );
                }

                return sendJSON(res, {
                    success: false
                });

            });
        }

if (
    req.method === "POST" &&
    req.url === "/api/logout"
) {

    const cookie =
        req.headers.cookie || "";

    const match =
        cookie.match(
            /(?:^|;\s*)session=([^;]+)/
        );

    if (match) {
        sessions.delete(match[1]);
    }

    res.writeHead(200, {
        "Content-Type":
            "application/json; charset=utf-8",
        "Set-Cookie":
            "session=; HttpOnly; Path=/; Max-Age=0"
    });

    return res.end(
        JSON.stringify({
            success: true
        })
    );
}

        // =========================
        // STUDENTS
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/api/students"
        ) {
            const result = db.exec("SELECT * FROM students ORDER BY id DESC");

            let students = [];

            if (result.length > 0) {
                const columns = result[0].columns;
                const values = result[0].values;

                students = values.map(row => {
                    const student = {};

                    columns.forEach((column, index) => {
                        student[column] = row[index];
                    });

                    return student;
                });
            }

            return sendJSON(res, students);
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

                return sendJSON(res, {
                    message: "Student added"
                });
            });
        }

        if (
            req.method === "DELETE" &&
            req.url.startsWith("/api/students/")
        ) {
            const id =
                req.url.split("/").pop();

            db.run(
                "DELETE FROM students WHERE id = ?",
                [id]
            );

            saveDatabase();

            return sendJSON(res, {
                message: "Student deleted"
            });
        }
// EDIT STUDENT

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

        return sendJSON(res, {
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
            const result = db.exec("SELECT * FROM teachers ORDER BY id DESC");

            let teachers = [];

            if (result.length > 0) {
                const columns = result[0].columns;
                const values = result[0].values;

                teachers = values.map(row => {
                    const teacher = {};

                    columns.forEach((column, index) => {
                        teacher[column] = row[index];
                    });

                    return teacher;
                });
            }

            return sendJSON(res, teachers);
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

                return sendJSON(res, {
                    message: "Teacher added"
                });
            });
        }

        if (
            req.method === "DELETE" &&
            req.url.startsWith("/api/teachers/")
        ) {
            const id =
                req.url.split("/").pop();

            db.run(
                "DELETE FROM teachers WHERE id = ?",
                [id]
            );

            saveDatabase();

            return sendJSON(res, {
                message: "Teacher deleted"
            });
        }

// EDIT TEACHER

if (
    req.method === "PUT" &&
    req.url.startsWith("/api/teachers/")
) {
    const id = req.url.split("/").pop();

    return readBody(req, (teacher) => {

        db.run(
            `UPDATE teachers
             SET name = ?,
                 father = ?,
                 subject = ?,
                 phone = ?
             WHERE id = ?`,
            [
                teacher.name,
                teacher.father,
                teacher.subject,
                teacher.phone,
                id
            ]
        );

        saveDatabase();

          return sendJSON(res, {
              message: "Teacher updated"
          });
      });
  }     

   // =========================
        // ATTENDANCE
        // =========================

if (
    req.method === "GET" &&
    req.url.startsWith("/api/attendance")
) {
    const url = new URL(
        req.url,
        "http://localhost:3000"
    );

    const date =
        url.searchParams.get("date");

    const studentId =
        url.searchParams.get("studentId");

    let result;

    // Student attendance history
    if (studentId) {

        result = db.exec(
            `SELECT *
             FROM attendance
             WHERE studentId = ?
             ORDER BY date DESC, id DESC`,
            [studentId]
        );

    // Attendance for a specific date
    } else if (date) {

        result = db.exec(
            `SELECT *
             FROM attendance
             WHERE date = ?
             ORDER BY id DESC`,
            [date]
        );

    // No filter
    } else {

        result = db.exec(
            `SELECT *
             FROM attendance
             ORDER BY date DESC, id DESC`
        );
    }

    return sendJSON(res, result);

}     
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

                return sendJSON(res, {
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

                return sendJSON(res, {
                    message: "Fee payment saved"
                });
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

                return sendJSON(res, {
                    message: "Class added"
                });
            });
        }


        // EDIT CLASS

        if (
            req.method === "PUT" &&
            req.url.startsWith("/api/classes/")
        ) {
            const id =
                req.url.split("/").pop();

            return readBody(req, (classData) => {

                db.run(
                    `UPDATE classes
                     SET className = ?,
                         section = ?
                     WHERE id = ?`,
                    [
                        classData.className,
                        classData.section,
                        id
                    ]
                );

                saveDatabase();

                return sendJSON(res, {
                    message: "Class updated"
                });
            });
        }

        if (
            req.method === "DELETE" &&
            req.url.startsWith("/api/classes/")
        ) {
            const id =
                req.url.split("/").pop();

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
        // NOT FOUND
        // =========================

        res.writeHead(404, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("Page not found");
    });

    if (require.main === module) {
        server.listen(process.env.PORT || 3000, () => {
            console.log(
                "School website running at http://localhost:3000"
            );
        });
    }

    return server;
}



// =========================
// SAVE DATABASE
// =========================

function saveDatabase() {
    if (process.env.VERCEL) {
        return;
    }

    const data = db.export();

    fs.writeFileSync(
        "school.db",
        Buffer.from(data)
    );
}

// =========================
// READ JSON BODY
// =========================

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


// =========================
// SEND JSON
// =========================

function sendJSON(res, data) {

    let output = data;

    if (
        Array.isArray(data) &&
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
        "Content-Type":
            "application/json; charset=utf-8"
    });

    res.end(JSON.stringify(output));
}


// =========================
// SEND FILE
// =========================


function sendFile(res, file, type) {
    const filePath = path.join(__dirname, "public", file);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {
                "Content-Type":
                    "text/plain; charset=utf-8"
            });

            return res.end("File not found");
        }

        res.writeHead(200, {
            "Content-Type": type
        });

        res.end(data);
    });
}

module.exports = startServer;
