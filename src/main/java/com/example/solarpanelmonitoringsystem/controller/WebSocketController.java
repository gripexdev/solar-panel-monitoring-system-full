package com.example.solarpanelmonitoringsystem.controller;

import com.example.solarpanelmonitoringsystem.dto.SensorDataDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/sensor-data")
    @SendTo("/topic/sensor-data")
    public SensorDataDto broadcastSensorData(SensorDataDto sensorData) {
        return sensorData;
    }
}