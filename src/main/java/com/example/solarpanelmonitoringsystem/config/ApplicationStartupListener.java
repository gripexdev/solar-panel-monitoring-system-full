package com.example.solarpanelmonitoringsystem.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStartupListener {
    
    private static final Logger logger = LoggerFactory.getLogger(ApplicationStartupListener.class);
    
    @EventListener(ApplicationStartedEvent.class)
    public void onApplicationStarted() {
        logger.info("🚀 Application started event triggered");
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        logger.info("✅ Application ready event triggered - Application is fully started and ready to serve requests");
        logger.info("🌐 Health check available at: /actuator/health");
        logger.info("🏠 Root endpoint available at: /");
        logger.info("📊 API endpoints available at: /auth/**, /user/**, /admin/**");
    }
} 