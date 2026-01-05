# RFID Attendance System

![Latest version badge](https://img.shields.io/github/v/release/lxysgp/rfid-project?label=latest%20release&labelColor=grey&color=blue)
![License: MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![mysql2](https://img.shields.io/badge/3.16.0-green.svg)

A lightweight **RFID-based attendance system API** built with **Node.js, Express, and MySQL**.  
Designed to receive RFID scan data, link card UIDs to students, and provide attendance records via simple HTTP endpoints.

> [!NOTE]
> This project is still under development. If you encounter bugs, please open an entry in the **Issues** tab.

---

## Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Run](#run)
- [API Reference](#api-reference)
  - [Health](#health)
  - [Scans](#scans)
  - [Students](#students)
- [License](#license)

---

## Features

- Record RFID scans into MySQL (attendance log)
- Link RFID UID to student details (name/class/student number)
- Browser-friendly endpoints (can test by typing URLs)
- List & filter scans by UID/device/time
- Built-in CORS support for web UI
---

## Quick Start

### Install dependencies

```bash
npm install express mysql2 cors
```

### Start the server

```bash
node server.js
```

Expected output:

```txt
Connected to database
Server is running on port: 3000
```

---

## Database Setup

Create a MySQL database (example): `attendance_system`  
> Tip: Avoid spaces in database names to reduce confusion.

### Create tables

Run the following SQL in **phpMyAdmin → SQL** tab (or MySQL console).

#### `students`

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  student_no VARCHAR(50),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### `attendance`

```sql
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(50) NOT NULL,
  device_id VARCHAR(50),
  scanned_at DATETIME NOT NULL
);
```

---

## Configuration

Update the MySQL connection in `server.js`:

```js
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "attendance system"
});
```

---

## Run

```bash
node server.js
```

Base URL:

```txt
http://localhost:3000
```

---

## API Reference

### Health

#### `GET /`

Returns a simple message.

**Example**
```txt
http://localhost:3000/
```

**Response**
```txt
Server is running!
```

---

### Scans

#### `GET /api/scans`

Records a scan (writes into MySQL) using query parameters.

**Example**
```txt
http://localhost:3000/api/scans?uid=12345678&device_id=gate-A
```

**Success Response**
```json
{
  "statusCode": "Success",
  "statusRemarks": "Confirmed written in DB",
  "id": 12,
  "uid": "12345678",
  "device_id": "gate-A",
  "scanned_at": "2026-01-05T08:31:04.659Z"
}
```

**Error Response (missing uid)**
```json
{
  "ok": false,
  "error": "Missing uid"
}
```

---

#### `POST /api/scans`

Records a scan (writes into MySQL) using a JSON body.

**Endpoint**
```txt
http://localhost:3000/api/scans
```

**Body**
```json
{
  "uid": "12345678",
  "device_id": "gate-A"
}
```

**Success Response**
```json
{
  "statusCode": "Success",
  "statusRemarks": "Confirmed written in DB",
  "id": 12,
  "uid": "12345678",
  "device_id": "gate-A",
  "scanned_at": "2026-01-05T08:31:04.659Z"
}
```

---

#### `GET /api/scans/list`

Lists scans with optional filters.

**Query parameters**
- `from` — start datetime
- `to` — end datetime
- `uid` — filter by UID
- `device_id` — filter by device
- `limit` — max rows (default 200, max 1000)

**Example (latest 50 rows)**
```txt
http://localhost:3000/api/scans/list?limit=50
```

**Example (filter by UID)**
```txt
http://localhost:3000/api/scans/list?uid=12345678
```

**Response**
```json
{
  "ok": true,
  "rows": [
    {
      "id": 12,
      "uid": "12345678",
      "device_id": "gate-A",
      "scanned_at": "2026-01-05T08:31:04.659Z"
    }
  ]
}
```

---

### Students

#### `GET /api/students/add`

Adds or updates a student record by UID (browser-friendly).

**Query parameters**
- `uid` *(required)*
- `name` *(required)*
- `class_name` *(required)*
- `student_no` *(optional)*

**Example**
```txt
http://localhost:3000/api/students/add?uid=12345678&name=Alice%20Tan&class_name=2A1&student_no=S1234567
```

**Response (HTML)**
```txt
Student linked!
UID: 12345678
Name: Alice Tan
Class: 2A1
```

---

#### `GET /api/students/by-uid`

Looks up student info by UID.

**Example**
```txt
http://localhost:3000/api/students/by-uid?uid=12345678
```

**Response (found)**
```json
{
  "ok": true,
  "student": {
    "name": "Alice Tan",
    "class_name": "2A1",
    "student_no": "S1234567"
  }
}
```

**Response (not found)**
```json
{
  "ok": true,
  "student": null
}
```

---

## License

[MIT License](./LICENSE) ([view on choosealicense.com](https://choosealicense.com/licenses/mit/)).

