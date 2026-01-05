# RFID Attendance System — Project Overview

This repository contains the **overall RFID Attendance System project**, combining **hardware**, **backend software**, and **frontend UI** components to enable RFID-based attendance taking.

Each major component has its **own detailed README** inside its respective folder.  
This document provides a **high-level overview only**.

---

## Hardware

The hardware component is responsible for **reading RFID cards** and sending UID data to the backend.

- ESP32 microcontroller  
- RC522 RFID/NFC reader  
- Sends UID and device ID to the API via HTTP  

Refer to `hardware/README.md` for:
- Wiring diagrams
- Firmware code
- Deployment instructions

---

## Software (Backend)

The backend provides the **core logic and APIs** for the system.

- Node.js + Express server
- MySQL database (phpMyAdmin compatible)
- REST-style endpoints for scans and student management

Responsibilities:
- Store RFID scan records
- Link UID to student information
- Provide attendance data for UI consumption

Refer to `backend/README.md` for:
- API documentation
- Database schema
- Setup and configuration

---

## User Interface (UI)

The UI allows **teachers/admins** to view attendance records and student information.

- Static web frontend (HTML/CSS/JS)
- Fetches data from backend APIs
- Can be hosted locally or via a CDN (e.g. jsDelivr)

Refer to `ui/README.md` for:
- UI usage
- Hosting instructions
- Screenshots and features

---

## License

This project is released under the **MIT License**.  
See the `LICENSE` file for details.
