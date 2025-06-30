package com.example.solarpanelmonitoringsystem;

import com.example.solarpanelmonitoringsystem.entity.OurUsers;
import com.example.solarpanelmonitoringsystem.repository.UsersRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SolarPanelMonitoringSystemApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(SolarPanelMonitoringSystemApplication.class);

    public static void main(String[] args) {
        logger.info("Starting Solar Panel Monitoring System Application...");
        try {
            SpringApplication.run(SolarPanelMonitoringSystemApplication.class, args);
            logger.info("🎉 Solar Panel Monitoring System Application started successfully!");
            logger.info("🌐 Application is now ready to serve requests");
            logger.info("📊 Health check available at: /health");
            logger.info("🏠 Root endpoint available at: /");
        } catch (Exception e) {
            logger.error("Failed to start Solar Panel Monitoring System Application", e);
            throw e;
        }
    }

    @Bean
    CommandLineRunner run(UsersRepo userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            logger.info("Starting CommandLineRunner...");
            try {
                String email = "admin@admin.com";
                logger.info("Checking for existing admin user...");
                OurUsers existingUser = userRepository.findByEmail(email);
                if(existingUser != null){
                    logger.info("Deleting existing admin user...");
                    userRepository.delete(existingUser);
                }

                logger.info("Creating new admin user...");
                OurUsers user = new OurUsers();
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("adminadmin"));
                user.setRole("ADMIN");
                userRepository.save(user);

                logger.info("Default admin user created successfully.");
                System.out.println("Default admin user created successfully.");
            } catch (Exception e) {
                logger.error("Error creating default admin user: " + e.getMessage(), e);
                System.err.println("Error creating default admin user: " + e.getMessage());
                // Don't fail the application if user creation fails
            }
            logger.info("CommandLineRunner completed.");
        };
    }
}
