package com.example.solarpanelmonitoringsystem.config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {
    private static final Logger logger = LoggerFactory.getLogger(MqttConfig.class);

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;

    @Value("${mqtt.connection.timeout:30}")
    private int connectionTimeout;

    @Value("${mqtt.keepalive.interval:60}")
    private int keepAliveInterval;

    @Bean
    public MqttClient mqttClient() {
        try {
            MqttClient client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            MqttConnectOptions options = new MqttConnectOptions();

            options.setUserName(username);
            options.setPassword(password.toCharArray());
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(connectionTimeout);
            options.setKeepAliveInterval(keepAliveInterval);

            // Try to connect but don't fail the application if it doesn't work
            try {
                client.connect(options);
                logger.info("Connected to MQTT broker at {}", brokerUrl);
            } catch (MqttException e) {
                logger.warn("Failed to connect to MQTT broker at startup: {}. Application will continue without MQTT.", e.getMessage());
                // Don't throw the exception, just log it and continue
            }
            
            return client;
        } catch (Exception e) {
            logger.error("Failed to create MQTT client", e);
            // Return null instead of throwing exception to allow application to start
            return null;
        }
    }
}
