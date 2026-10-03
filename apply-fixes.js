// apply-fixes.js
// Run inside your project folder (where server.js is):  node apply-fixes.js
// It saves a backup as server.js.bak, applies fixes 1-5, checks the syntax,
// and restores the original file automatically if anything is broken.

const fs = require("fs");
const { execSync } = require("child_process");

const file = "server.js";

if (!fs.existsSync(file)) {
    console.log("server.js not found. Run this inside your project folder.");
    process.exit(1);
}

const original = fs.readFileSync(file, "utf8");
fs.writeFileSync(file + ".bak", original);

let s = original;
const results = [];

function step(name, fn) {
    try {
        const out = fn(s);
        if (out === "skip") results.push(["SKIP", name, "(already applied or not needed)"]);
        else if (out === null) results.push(["FAIL", name, "(code not found - apply by hand from server-fixes.md)"]);
        else { s = out; results.push(["OK  ", name, ""]); }
    } catch (e) {
        results.push(["FAIL", name, "(" + e.message + ")"]);
    }
}

// 1. Serve layout.css and layout.js
step("Fix 1: serve layout.css / layout.js", (t) => {
    if (t.includes('"/layout.css"')) return "skip";
    const re = /if\s*\(\s*req\.method\s*===\s*"GET"\s*&&\s*req\.url\s*===\s*"\/mobile-nav\.js"\s*\)\s*\{[\s\S]*?\n\s*\}/;
    const m = t.match(re);
    if (!m) return null;
    const add = [
        "",
        "",
        '        if (req.method === "GET" && req.url === "/layout.css") {',
        '            return sendFile(res, "layout.css", "text/css");',
        "        }",
        "",
        '        if (req.method === "GET" && req.url === "/layout.js") {',
        '            return sendFile(res, "layout.js", "application/javascript");',
        "        }"
    ].join("\n");
    return t.replace(re, () => m[0] + add);
});

// 2. Class name field (students)
step("Fix 2: class name field", (t) => {
    if (t.includes("student.classname || student.className")) return "skip";
    let u = t.replace(/classname\s+AS\s+"className"\s*,/, "classname,");
    u = u.replace(/student\.className/g, "(student.classname || student.className)");
    return u === t ? null : u;
});

// 3. Fees: field names + validation
step("Fix 3: fees fields and validation", (t) => {
    if (t.includes("Invalid fee amounts")) return "skip";
    const sel = /fees\.id,\s*students\.name\s+AS\s+"studentName",\s*fees\.totalfees\s+AS\s+"totalFees",\s*fees\.paidamount\s+AS\s+"paidAmount",\s*fees\.remaining,\s*fees\.paymentdate\s+AS\s+"paymentDate"/;
    const ins = /await pool\.query\(\s*`INSERT INTO fees/;
    const rem = /fee\.remaining(\s*,)/;
    if (!sel.test(t) || !ins.test(t) || !rem.test(t)) return null;

    let u = t.replace(sel, () => [
        "fees.id,",
        "                    students.name AS studentname,",
        "                    fees.totalfees,",
        "                    fees.paidamount,",
        "                    fees.remaining,",
        "                    fees.paymentdate::text AS paymentdate"
    ].join("\n"));

    u = u.replace(ins, (m) => [
        "const total = Number(fee.totalFees);",
        "            const paid = Number(fee.paidAmount);",
        "",
        "            if (!(total >= 0) || !(paid >= 0) || paid > total) {",
        '                return sendJSON(res, { error: "Invalid fee amounts" }, 400);',
        "            }",
        "",
        "            "
    ].join("\n") + m);

    u = u.replace(rem, (m, c) => "(total - paid)" + c);
    return u;
});

// 4. Attendance GET
step("Fix 4: attendance details + filters", (t) => {
    if (t.includes("const params = [session.school_id];")) return "skip";
    const re = /let result;\s*\/\/ Student attendance history[\s\S]*?\n\s*\}\s*\n\s*return sendJSON\(res, result\.rows\);/;
    if (!re.test(t)) return null;

    const code = [
        "const params = [session.school_id];",
        '        let where = "students.school_id = $1";',
        "",
        "        if (date) {",
        "            params.push(date);",
        '            where += " AND attendance.date = $" + params.length;',
        "        }",
        "",
        "        if (studentId) {",
        "            params.push(studentId);",
        '            where += " AND attendance.studentid = $" + params.length;',
        "        }",
        "",
        "        const result = await pool.query(",
        "            `SELECT",
        "                attendance.id,",
        '                attendance.studentid AS "studentId",',
        "                attendance.date::text AS date,",
        "                attendance.status,",
        "                students.name,",
        "                students.classname,",
        "                students.roll",
        "             FROM attendance",
        "             JOIN students ON attendance.studentid = students.id",
        "             WHERE ${where}",
        "             ORDER BY attendance.date DESC, attendance.id DESC`,",
        "            params",
        "        );",
        "",
        "        return sendJSON(res, result.rows);"
    ].join("\n");

    return t.replace(re, () => code);
});

// 5. Logout regex
step("Fix 5: logout cookie regex", (t) => {
    const bad = String.raw`/(?:^|;\\s*)session=([^;]+)/`;
    const good = String.raw`/(?:^|;\s*)session=([^;]+)/`;
    return t.includes(bad) ? t.split(bad).join(good) : "skip";
});

fs.writeFileSync(file, s);

try {
    execSync("node --check " + file, { stdio: "pipe" });
    results.push(["OK  ", "Syntax check passed", ""]);
} catch (e) {
    fs.writeFileSync(file, original);
    results.push(["FAIL", "Syntax check failed", "(original server.js restored)"]);
}

console.log("");
results.forEach((r) => console.log("[" + r[0] + "] " + r[1] + " " + r[2]));
console.log("\nBackup saved as server.js.bak");
