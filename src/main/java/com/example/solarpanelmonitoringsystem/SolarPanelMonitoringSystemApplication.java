package com.example.solarpanelmonitoringsystem;

import com.example.solarpanelmonitoringsystem.entity.OurUsers;
import com.example.solarpanelmonitoringsystem.repository.UsersRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SolarPanelMonitoringSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SolarPanelMonitoringSystemApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UsersRepo userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                String email = "admin@admin.com";
                OurUsers existingUser = userRepository.findByEmail(email);
                if(existingUser != null){
                    userRepository.delete(existingUser);
                }

                OurUsers user = new OurUsers();
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("adminadmin"));
                user.setRole("ADMIN");
                userRepository.save(user);

                System.out.println("Default admin user created successfully.");
            } catch (Exception e) {
                System.err.println("Error creating default admin user: " + e.getMessage());
                // Don't fail the application if user creation fails
            }
        };
    }
}
