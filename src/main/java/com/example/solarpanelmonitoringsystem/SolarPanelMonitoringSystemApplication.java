package com.example.solarpanelmonitoringsystem;

import com.example.solarpanelmonitoringsystem.entity.OurUsers;
import com.example.solarpanelmonitoringsystem.repository.UsersRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.actuate.autoconfigure.metrics.SystemMetricsAutoConfiguration;

@SpringBootApplication
@EnableAutoConfiguration(exclude = { SystemMetricsAutoConfiguration.class })
public class SolarPanelMonitoringSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SolarPanelMonitoringSystemApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UsersRepo userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "admin@admin.com";
            OurUsers ourUsers = userRepository.findByEmail(email);
            if(ourUsers != null){
                userRepository.delete(ourUsers);
            }

            OurUsers user = new OurUsers();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("adminadmin"));
            user.setRole("ADMIN");
            userRepository.save(user);

            System.out.println("Default admin user created.");
        };
    }
}

// Add this configuration to disable ProcessorMetrics
@Configuration
class DisableProcessorMetricsConfig {
    @Bean
    public ProcessorMetrics processorMetrics() {
        // Return null to disable the bean
        return null;
    }
}
