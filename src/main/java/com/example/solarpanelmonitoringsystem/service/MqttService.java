package com.example.solarpanelmonitoringsystem.service;

import com.example.solarpanelmonitoringsystem.dto.ControlCommandDto;
import com.example.solarpanelmonitoringsystem.dto.PlantRequirementsDto;
import com.example.solarpanelmonitoringsystem.dto.SensorDataDto;
import com.example.solarpanelmonitoringsystem.entity.SensorData;
import com.example.solarpanelmonitoringsystem.repository.SensorDataRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    private SensorDataDto latestSensorData;

    private SensorDataRepo sensorDataRepo;

    @Value("${mqtt.topic.sensor-data}")
    private String sensorDataTopic;

    @Value("${mqtt.topic.control}")
    private String controlTopic;

    @Value("${mqtt.topic.plant-requirements}")
    private String plantRequirementsTopic;

    public MqttService(MqttClient mqttClient,
                       SimpMessagingTemplate messagingTemplate,
                       ObjectMapper objectMapper, SensorDataRepo sensorDataRepo) {
        this.mqttClient = mqttClient;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
        this.sensorDataRepo = sensorDataRepo;
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

            // Saving the sensor data to the database
            SensorData sensorData1 = new SensorData();
            sensorData1.setHumidity(sensorData.getHumidity());
            sensorData1.setTemperature(sensorData.getTemperature());
            sensorData1.setRadiation(sensorData.getRadiation());
            sensorData1.setPvAngle(sensorData.getPvAngle());
            sensorData1.setSwitchState(sensorData.getSwitchState());
            sensorData1.setWindSpeed(sensorData.getWindSpeed());
            sensorData1.setRainDetected(sensorData.isRainDetected());
            sensorData1.setSnow(sensorData.isSnow());
            sensorData1.setTimestamp(sensorData.getTimestamp());
            sensorDataRepo.save(sensorData1);

            this.latestSensorData = sensorData;
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

    // This method is used to publish control command to the MQTT broker
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

    // This method is used to publish plant requirements to the MQTT broker
    public void publishPlantRequirements(PlantRequirementsDto requirements) throws MqttException {
        if (plantRequirementsTopic == null || plantRequirementsTopic.isEmpty()) {
            throw new IllegalStateException("Plant requirements topic not configured");
        }

        try {
            String message = objectMapper.writeValueAsString(requirements);
            publishMessage(plantRequirementsTopic, message);
            logger.info("Published plant requirements to MQTT: {}", requirements);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing plant requirements", e);
            throw new MqttException(e);
        }
    }

    // Method to get the latest sensor data
    public SensorDataDto getLatestSensorData() {
        return latestSensorData;
    }
}