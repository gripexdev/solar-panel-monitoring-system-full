package com.example.solarpanelmonitoringsystem.service;

import com.example.solarpanelmonitoringsystem.dto.ControlCommandDto;
import com.example.solarpanelmonitoringsystem.dto.SensorDataDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


/*
    System Flow:

        IoT Devices → [MQTT Broker] → MqttService → WebSocket → Dashboard Clients
           ↑                      ↓
           ˅________MqttController (HTTP API)
 */

@Service
public class MqttService implements MqttCallback {
    private static final Logger logger = LoggerFactory.getLogger(MqttService.class);

    private final MqttClient mqttClient;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Value("${mqtt.topic.sensor-data}")
    private String sensorDataTopic;

    @Value("${mqtt.topic.control}")
    private String controlTopic;

    public MqttService(MqttClient mqttClient,
                       SimpMessagingTemplate messagingTemplate,
                       ObjectMapper objectMapper) {
        this.mqttClient = mqttClient;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            if (mqttClient != null) {
                mqttClient.setCallback(this);
                subscribeToTopics();
            }
        } catch (Exception e) {
            logger.error("Error initializing MQTT service", e);
        }
    }

    private void subscribeToTopics() throws MqttException {
        if (sensorDataTopic != null && !sensorDataTopic.isEmpty()) {
            mqttClient.subscribe(sensorDataTopic);
            logger.info("Subscribed to topic: {}", sensorDataTopic);
        } else {
            logger.warn("Sensor data topic not configured");
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        logger.error("MQTT connection lost", cause);
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        try {
            String payload = new String(message.getPayload());
            logger.debug("Received message on topic {}: {}", topic, payload);

            SensorDataDto sensorData = objectMapper.readValue(payload, SensorDataDto.class);
            messagingTemplate.convertAndSend("/topic/sensor-data", sensorData);
            // Debbuging
            logger.info("Raw payload: {}", payload);
            logger.info("Parsed data: {}", sensorData);
        } catch (JsonProcessingException e) {
            logger.error("Error processing MQTT message", e);
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // Not used in this implementation
    }

    public void publishMessage(String topic, String message) throws MqttException {
        if (topic == null || topic.isEmpty()) {
            throw new IllegalArgumentException("Topic cannot be null or empty");
        }

        MqttMessage mqttMessage = new MqttMessage(message.getBytes());
        mqttMessage.setQos(1);
        mqttMessage.setRetained(true);
        mqttClient.publish(topic, mqttMessage);
        logger.debug("Published message to topic {}: {}", topic, message);
    }

    // Add this method to your existing MqttService class
    public void publishControlCommand(ControlCommandDto command) throws MqttException {
        if (controlTopic == null || controlTopic.isEmpty()) {
            throw new IllegalStateException("Control topic not configured");
        }

        try {
            String message = objectMapper.writeValueAsString(command);
            publishMessage(controlTopic, message);
            logger.info("Published control command to MQTT: {}", command);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing control command", e);
            throw new MqttException(e);
        }
    }
}