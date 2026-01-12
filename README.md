# RFID Attendance System — W@W Project Overview!!

This repository contains the **overall RFID Attendance System project**, combining **hardware**, **backend software**, and **frontend UI** components to enable RFID-based attendance taking.

Each major component has its **own detailed README** inside its respective folder.  

---

## Hardware

The hardware component is responsible for **reading RFID cards** and sending UID data to the backend.

- ESP32 microcontroller / Raspberry Pi 5?
- RC522 RFID/NFC reader
- HDMI OLED screen
- Sends UID and device ID to the API via HTTP  

Refer to `hardware/README.md`

---

## Software (Backend)

The backend provides the **core logic and APIs** for the system.

- Node.js + Express server
- MySQL database (phpMyAdmin compatible)
- endpoints for scans and student management

Responsibilities:
- Store RFID scan records
- Link UID to student information
- Provide attendance data for UI consumption

Refer to `backend/README.md`

---

## User Interface (UI)

The UI allows **teachers/admins** to view attendance records and student information.

- Static web frontend (HTML/CSS/JS)
- Fetches data from backend APIs
- Can be hosted locally or via a CDN (e.g. jsDelivr)

Refer to `ui/README.md`

---

## License

This project is released under the **MIT License**.  
See the `LICENSE` file for details.

flowchart LR
  A[RFID Card/Tag<br/>UID] --> B[ESP32 + RC522<br/>SPI read UID]
  B -->|HTTP GET/POST<br/>uid + device_id| C[Node.js + Express API<br/>CORS enabled<br/>Single server file]

  C -->|mysql2 SQL| D[(MySQL)]
  D --> E1[name table<br/>uid -> name]
  D --> E2[attendance table<br/>immutable logs<br/>uid + name snapshot + device_id + time]

  F[Admin Web UI<br/>Static HTML/CSS/JS<br/>GitHub Pages/jsDelivr/local] -->|fetch() API| C

  D --> G[phpMyAdmin<br/>Initial DB setup / rare maintenance]

