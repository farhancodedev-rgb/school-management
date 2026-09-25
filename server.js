require("dotenv").config();
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const path = require("path");
let sessions = new Set();

async function startServer() {

    // =========================
    // DATABASE TABLES
    // =========================

    // =========================
    // SERVER
    // =========================

const server = http.createServer(async (req, res) => {

// =========================
// DASHBOARD API
// =========================

if (
    req.method === "GET" &&
    req.url === "/api/dashboard"
) {
    try {

        const studentsResult = await pool.query(
            "SELECT COUNT(*)::int AS total FROM students"
        );

        const teachersResult = await pool.query(
            "SELECT COUNT(*)::int AS total FROM teachers"
        );

        const classesResult = await pool.query(
            "SELECT COUNT(*)::int AS total FROM classes"
        );

        const today =
            new Date().toISOString().split("T")[0];

        const attendanceResult = await pool.query(
            `SELECT
                COUNT(*)::int AS total,
                COUNT(*) FILTER (
                    WHERE LOWER(status) = 'present'
                )::int AS present
             FROM attendance
             WHERE date = $1`,
            [today]
        );

        return sendJSON(res, {
            students: studentsResult.rows[0].total,
            teachers: teachersResult.rows[0].total,
            classes: classesResult.rows[0].total,
            attendance: {
                total: attendanceResult.rows[0].total,
                present: attendanceResult.rows[0].present
            }
        });

    } catch (error) {

        console.log(
            "Dashboard GET error:",
            error.message
        );

        return sendJSON(res, {
            error: "Failed to load dashboard"
        });
    }
}

 // ========================= LOGIN 
// PROTECTION =========================


        // DIRECT LOGOUT
        if (req.method === "GET" && req.url === "/logout") {
            const cookie = req.headers.cookie || "";
            const match = cookie.match(/(?:^|;\\s*)session=([^;]+)/);

            if (match) {
                sessions.delete(match[1]);
            }

            res.writeHead(302, {
                "Location": "/login.html",
   "Set-Cookie": "session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0" +
(process.env.VERCEL ? "; Secure" : "")          });
            return res.end();
        }

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

                const correctUsername = process.env.ADMIN_USERNAME;
                const correctPassword = process.env.ADMIN_PASSWORD;

                if (
                    login.username === correctUsername &&
                    login.password === correctPassword
                ) {

                    const sessionId =
                        crypto.randomBytes(32).toString("hex");

                    sessions.add(sessionId);

                    res.writeHead(200, {
                        "Content-Type":
                            "application/json; charset=utf-8",
                        "Set-Cookie":
                            "session=" +
sessionId +
"; HttpOnly; Path=/; SameSite=Lax" +
(process.env.VERCEL ? "; Secure" : "")            });

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
            "session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
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
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                father,
                classname AS "className",
                roll
             FROM students
             ORDER BY id DESC`
        );

        return sendJSON(res, result.rows);

    } catch (error) {
        console.log("Students GET error:", error.message);

        return sendJSON(res, {
            error: "Failed to load students"
        });
    }
}


if (
    req.method === "POST" &&
    req.url === "/api/students"
) {
    return readBody(req, async (student) => {

        try {
            await pool.query(
                `INSERT INTO students
                (name, father, classname, roll)
                VALUES ($1, $2, $3, $4)`,
                [
                    student.name,
                    student.father,
                    student.className,
                    student.roll
                ]
            );

            return sendJSON(res, {
                message: "Student added"
            });

        } catch (error) {
            console.log("Students POST error:", error.message);

            return sendJSON(res, {
                error: "Failed to add student"
            });
        }
    });
}


if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/students/")
) {
    const id = req.url.split("/").pop();

    try {
        await pool.query(
            "DELETE FROM students WHERE id = $1",
            [id]
        );

        return sendJSON(res, {
            message: "Student deleted"
        });

    } catch (error) {
        console.log("Students DELETE error:", error.message);

        return sendJSON(res, {
            error: "Failed to delete student"
        });
    }
}


// EDIT STUDENT

if (
    req.method === "PUT" &&
    req.url.startsWith("/api/students/")
) {
    const id = req.url.split("/").pop();

    return readBody(req, async (student) => {

        try {
            await pool.query(
                `UPDATE students
                 SET name = $1,
                     father = $2,
                     classname = $3,
                     roll = $4
                 WHERE id = $5`,
                [
                    student.name,
                    student.father,
                    student.className,
                    student.roll,
                    id
                ]
            );

            return sendJSON(res, {
                message: "Student updated"
            });

        } catch (error) {
            console.log("Students PUT error:", error.message);

            return sendJSON(res, {
                error: "Failed to update student"
            });
        }
    });
}

// =========================
// TEACHERS
// =========================

if (
    req.method === "GET" &&
    req.url === "/api/teachers"
) {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                father,
                subject,
                phone
             FROM teachers
             ORDER BY id DESC`
        );

        return sendJSON(res, result.rows);

    } catch (error) {
        console.log("Teachers GET error:", error.message);

        return sendJSON(res, {
            error: "Failed to load teachers"
        });
    }
}


if (
    req.method === "POST" &&
    req.url === "/api/teachers"
) {
    return readBody(req, async (teacher) => {

        try {
            await pool.query(
                `INSERT INTO teachers
                (name, father, subject, phone)
                VALUES ($1, $2, $3, $4)`,
                [
                    teacher.name,
                    teacher.father,
                    teacher.subject,
                    teacher.phone
                ]
            );

            return sendJSON(res, {
                message: "Teacher added"
            });

        } catch (error) {
            console.log("Teachers POST error:", error.message);

            return sendJSON(res, {
                error: "Failed to add teacher"
            });
        }
    });
}


if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/teachers/")
) {
    const id = req.url.split("/").pop();

    try {
        await pool.query(
            "DELETE FROM teachers WHERE id = $1",
            [id]
        );

        return sendJSON(res, {
            message: "Teacher deleted"
        });

    } catch (error) {
        console.log("Teachers DELETE error:", error.message);

        return sendJSON(res, {
            error: "Failed to delete teacher"
        });
    }
}


// EDIT TEACHER

if (
    req.method === "PUT" &&
    req.url.startsWith("/api/teachers/")
) {
    const id = req.url.split("/").pop();

    return readBody(req, async (teacher) => {

        try {
            await pool.query(
                `UPDATE teachers
                 SET name = $1,
                     father = $2,
                     subject = $3,
                     phone = $4
                 WHERE id = $5`,
                [
                    teacher.name,
                    teacher.father,
                    teacher.subject,
                    teacher.phone,
                    id
                ]
            );

            return sendJSON(res, {
                message: "Teacher updated"
            });

        } catch (error) {
            console.log("Teachers PUT error:", error.message);

            return sendJSON(res, {
                error: "Failed to update teacher"
            });
        }
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

    try {

        let result;

        // Student attendance history
        if (studentId) {

            result = await pool.query(
                `SELECT
                    id,
                    studentid AS "studentId",
                    date,
                    status
                 FROM attendance
                 WHERE studentid = $1
                 ORDER BY date DESC, id DESC`,
                [studentId]
            );

        // Attendance for a specific date
        } else if (date) {

            result = await pool.query(
                `SELECT
                    id,
                    studentid AS "studentId",
                    date,
                    status
                 FROM attendance
                 WHERE date = $1
                 ORDER BY id DESC`,
                [date]
            );

        // No filter
        } else {

            result = await pool.query(
                `SELECT
                    id,
                    studentid AS "studentId",
                    date,
                    status
                 FROM attendance
                 ORDER BY date DESC, id DESC`
            );
        }

        return sendJSON(res, result.rows);

    } catch (error) {

        console.log(
            "Attendance GET error:",
            error.message
        );

        return sendJSON(res, {
            error: "Failed to load attendance"
        });
    }
}

if (
    req.method === "POST" &&
    req.url === "/api/attendance"
) {
    return readBody(req, async (attendance) => {

        try {

            await pool.query(
                `INSERT INTO attendance
                (studentid, date, status)
                VALUES ($1, $2, $3)`,
                [
                    attendance.studentId,
                    attendance.date,
                    attendance.status
                ]
            );

            return sendJSON(res, {
                message: "Attendance saved"
            });

        } catch (error) {

            console.log(
                "Attendance POST error:",
                error.message
            );

            return sendJSON(res, {
                error: "Failed to save attendance"
            });
        }
    });
}

// =========================
// FEES
// =========================

if (
    req.method === "GET" &&
    req.url === "/api/fees"
) {
    try {

        const result = await pool.query(`
            SELECT
                fees.id,
                students.name AS "studentName",
                fees.totalfees AS "totalFees",
                fees.paidamount AS "paidAmount",
                fees.remaining,
                fees.paymentdate AS "paymentDate"
            FROM fees
            JOIN students
            ON fees.studentid = students.id
            ORDER BY fees.id DESC
        `);

        return sendJSON(res, result.rows);

    } catch (error) {

        console.log(
            "Fees GET error:",
            error.message
        );

        return sendJSON(res, {
            error: "Failed to load fees"
        });
    }
}


if (
    req.method === "POST" &&
    req.url === "/api/fees"
) {
    return readBody(req, async (fee) => {

        try {

            await pool.query(
                `INSERT INTO fees
                (
                    studentid,
                    totalfees,
                    paidamount,
                    remaining,
                    paymentdate
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    fee.studentId,
                    fee.totalFees,
                    fee.paidAmount,
                    fee.remaining,
                    fee.paymentDate
                ]
            );

            return sendJSON(res, {
                message: "Fee payment saved"
            });

        } catch (error) {

            console.log(
                "Fees POST error:",
                error.message
            );

            return sendJSON(res, {
                error: "Failed to save fee payment"
            });
        }
    });
}


// =========================
// CLASSES
// =========================

if (
    req.method === "GET" &&
    req.url === "/api/classes"
) {
    try {

        const result = await pool.query(
            `SELECT
                id,
                classname AS "className",
                section
             FROM classes
             ORDER BY id DESC`
        );

        return sendJSON(res, result.rows);

    } catch (error) {

        console.log(
            "Classes GET error:",
            error.message
        );

        return sendJSON(res, {
            error: "Failed to load classes"
        });
    }
}



if (
    req.method === "POST" &&
    req.url === "/api/classes"
) {
    return readBody(req, async (classData) => {

        try {

            await pool.query(
                `INSERT INTO classes
                (classname, section)
                VALUES ($1, $2)`,
                [
                    classData.className,
                    classData.section
                ]
            );

            return sendJSON(res, {
                message: "Class added"
            });

        } catch (error) {

            console.log(
                "Classes POST error:",
                error.message
            );

            return sendJSON(res, {
                error: "Failed to add class"
            });
        }
    });
}

if (
    req.method === "PUT" &&
    req.url.startsWith("/api/classes/")
) {
    const id =
        req.url.split("/").pop();

    return readBody(req, async (classData) => {

        try {

            await pool.query(
                `UPDATE classes
                 SET classname = $1,
                     section = $2
                 WHERE id = $3`,
                [
                    classData.className,
                    classData.section,
                    id
                ]
            );

            return sendJSON(res, {
                message: "Class updated"
            });

        } catch (error) {

            console.log(
                "Classes PUT error:",
                error.message
            );

            return sendJSON(res, {
                error: "Failed to update class"
            });
        }
    });
}


if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/classes/")
) {
    const id =
        req.url.split("/").pop();

    try {

        await pool.query(
            "DELETE FROM classes WHERE id = $1",
            [id]
        );

        return sendJSON(res, {
            message: "Class deleted"
        });

    } catch (error) {

        console.log(
            "Classes DELETE error:",
            error.message
        );

        return sendJSON(res, {
            error: "Failed to delete class"
        });
    }
}
        // =========================
        // NOT FOUND
        // =========================

        res.writeHead(404, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("Page not found");
    });

server.listen(process.env.PORT || 3000, () => {
    console.log(
        "School website running at http://localhost:3000"
    );
});

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

if (require.main === module) {
    startServer();
}

module.exports = startServer;
