const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "attendance system"
});
db.connect(err => {
    if (err) {
        console.error("FAILED TO connect to database", err);
        return;
    }
    console.log("Connected to database");
});


const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/*test*/
app.get("/", (req, res) => {
    res.send("Server is running!");
});

function handleScanRequest(req, res) {
    //const { uid, device_id } = req.query || {};
    const uid = req.query["uid"];
    const device_id = req.query["device_id"];
    if (!uid) {
        return res.status(400).json({ok: false, error: "Missing uid"});
    }

    const scanned_at = new Date();

    const sql = `
        INSERT INTO attendance (uid, device_id, scanned_at)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [uid, device_id ?? null, scanned_at], (err, result) => {
        if (err) {
            console.error("Failed to save into DB:", err);
            return res.status(500).json({
                statusCode: "Failed",
                statusRemarks: "Failed to save DB",
                error: err.code });
        }

        res.json({
            statusCode: "Success",
            statusRemarks: "Confirmed written in DB",
            id: result.insertId,
            uid,
            device_id: device_id ?? "unknown",
            scanned_at: scanned_at.toISOString()
        });
    });
}
// Example:
// http://localhost:3000/api/students/add?uid=12345678&name=Alice&class_name=2A1&student_no=S123
app.get("/api/students/add", (req, res) => {
    const uid = req.query["uid"];
    const name = req.query["name"];
    const class_name = req.query["class_name"];
    const student_no = req.query["student_no"];
    if (!uid || !name || !class_name) {
        return res.status(400).send("Missing uid, name, or class_name");
    }

    const sql = `
    INSERT INTO students (uid, name, class_name, student_no)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      class_name = VALUES(class_name),
      student_no = VALUES(student_no)
  `;

    db.query(sql, [uid, name, class_name, student_no ?? null], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Failed to save into DB: " + err.code);
        }

        res.send(`Student linked!<br>
      UID: ${uid}<br>
      Name: ${name}<br>
      Class: ${class_name}<br>
      <a href="/api/students/add">Add another</a>
    `);
    });
});
// GET /api/students/by-uid?uid=12345678
app.get("/api/students/by-uid", (req, res) => {
    const { uid } = req.query;
    if (!uid) return res.json({ ok: false });

    db.query(
        "SELECT name, class_name, student_no FROM students WHERE uid = ?",
        [uid],
        (err, rows) => {
            if (err) return res.status(500).json({ ok: false });
            res.json({
                ok: true,
                student: rows[0] || null
            });
        }
    );
});

//GET: /api/scans?uid=123&device_id=gate-A
//POST: /api/scans
app.post("/api/scans", handleScanRequest);
app.get("/api/scans", handleScanRequest);

app.get("/api/scans/list", (req, res) => {
   const { from, to, uid, device_id } = req.query;
   const limit = Math.min(parseInt(req.query.limit || "200", 10), 1000);
   let sql = `SELECT id, uid, device_id, scanned_at FROM attendance WHERE 1=1`;
   const params = [];
   if(from){
       sql += ` AND scanned_at >= ?`;
       params.push(from);
   }
   if(to){
       sql += ` AND scanned_at <= ?`;
       params.push(to);
   }
   if (uid){
       sql += ` AND uid = ?`;
       params.push(uid);
   }
   if (device_id){
       sql += ` AND device_id = ?`;
       params.push(device_id);
   }
   sql += ` ORDER BY scanned_at DESC LIMIT ?`;
   params.push(limit);
   db.query(sql, params, (err, rows) => {
      if (err){
          console.error("DB ERROR:",err);
          return res.status(500).json({ok: false, error: err.code});
      }
      res.json({ok: true, rows});
   });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
})
