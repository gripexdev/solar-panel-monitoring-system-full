package com.example.solarpanelmonitoringsystem.controller;

import com.example.solarpanelmonitoringsystem.dto.PlantRequirementsDto;
import com.example.solarpanelmonitoringsystem.dto.SensorDataDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.example.solarpanelmonitoringsystem.dto.ControlCommandDto;
import com.example.solarpanelmonitoringsystem.service.MqttService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.eclipse.paho.client.mqttv3.MqttException;

@Controller
public class WebSocketController {

    /*
        Method flow:
            - A client sends a message to /app/sensor-data (since app is a prefix) with sensor data payload
            - The method receives the SensorDataDto object
            - The same data is returned and automatically broadcast to all subscribers of /topic/sensor-data
     */

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final MqttService mqttService;

    public WebSocketController(SimpMessagingTemplate messagingTemplate,
                               MqttService mqttService) {
        this.messagingTemplate = messagingTemplate;
        this.mqttService = mqttService;
    }

    @MessageMapping("/sensor-data")
    @SendTo("/topic/sensor-data")
    public SensorDataDto broadcastSensorData(SensorDataDto sensorData) {
        return sensorData;
    }

    @MessageMapping("/control")
    public void handleControlCommand(ControlCommandDto command) throws MqttException {
        logger.info("Received control command: {}", command);
        mqttService.publishControlCommand(command);
    }

    // This method is used to send emergency stop command to the MQTT broker
    @MessageMapping("/emergency")
    public void handleEmergencyStop(ControlCommandDto command) throws MqttException {
        logger.info("Received emergency stop command");

        // Force safety mode and emergency stop
        command.setMode("SAFETY");
        command.setEmergencyStop(true);
        command.setTargetAngle(0.0); // Set to safety position

        // Publish to MQTT
        mqttService.publishControlCommand(command);

        // Broadcast to all clients
        messagingTemplate.convertAndSend("/topic/emergency", command);
    }

    // plant requirements are sent to the MQTT broker
    @MessageMapping("/plant-requirements")
    public void handlePlantRequirements(PlantRequirementsDto requirements) throws MqttException {
        logger.info("Received plant requirements: {}", requirements);
        mqttService.publishPlantRequirements(requirements);
    }
}