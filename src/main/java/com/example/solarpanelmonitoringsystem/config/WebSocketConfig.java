package com.example.solarpanelmonitoringsystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /*
        How this class works:
            - A client connects to the webSocket endpoint ad /ws
            - When the client wants to send a message to the server, it uses destinations prefixed with /app
            - When the server wants to broadcast messages to clients, it sends them to destinations prefixed with /topic - All Subscribed clients will receive them
     */

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // register /ws as the webSocket endpoint that clients will use to connect to the server
                .setAllowedOriginPatterns("*"); // allow connections from any origin
    }
}