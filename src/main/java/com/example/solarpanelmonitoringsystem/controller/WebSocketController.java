package com.example.solarpanelmonitoringsystem.controller;

import com.example.solarpanelmonitoringsystem.dto.SensorDataDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    /*
        Method flow:
            - A client sends a message to /app/sensor-data (since app is a prefix) with sensor data payload
            - The method receives the SensorDataDto object
            - The same data is returned and automatically broadcast to all subscribers of /topic/sensor-data
     */

    @MessageMapping("/sensor-data")
    @SendTo("/topic/sensor-data")
    public SensorDataDto broadcastSensorData(SensorDataDto sensorData) {
        return sensorData;
    }
}