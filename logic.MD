flowchart LR
  A[RFID Card/Tag<br/>UID] --> B[ESP32 + RC522<br/>SPI read UID]
  B -->|HTTP GET/POST<br/>uid + device_id| C[Node.js + Express API<br/>CORS enabled<br/>Single server file]

  C -->|mysql2 SQL| D[(MySQL)]
  D --> E1[name table<br/>uid -> name]
  D --> E2[attendance table<br/>immutable logs<br/>uid + name snapshot + device_id + time]

  F[Admin Web UI<br/>Static HTML/CSS/JS<br/>GitHub Pages/jsDelivr/local] -->|fetch() API| C

  D --> G[phpMyAdmin<br/>Initial DB setup / rare maintenance]
