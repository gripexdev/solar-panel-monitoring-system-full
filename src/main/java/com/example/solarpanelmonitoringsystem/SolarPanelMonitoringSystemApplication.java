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
            String email = "omar@omar.com";
            OurUsers user = new OurUsers();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("omaromar"));
            user.setRole("ADMIN"); // or whatever role you use
            userRepository.save(user);
            System.out.println("Default admin user created.");
        };
    }
}
