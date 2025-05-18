# 🌞 Solar Panel Monitoring System

![Dashboard Screenshot](./docs/screenshot.png) *(add screenshot later)*

Real-time monitoring of solar panels with MQTT/WebSocket communication.

## Features
- Auth System ( USER | ADMIN )
- Live panel angle visualization
- Efficiency and temperature tracking
- Web-based control interface
- Real-time data updates

## Tech Stack
**Frontend**: React, Chart.js, STOMP.js  
**Backend**: Spring Boot, MQTT (Eclipse Paho)  -- java && jdk 17
**Broker**: EMQX  

## Setup
```bash
# Backend
cd solar-backend
mvn spring-boot:run

# Frontend
cd solar-dashboard
npm install
npm run dev
