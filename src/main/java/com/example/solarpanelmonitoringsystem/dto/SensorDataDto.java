package com.example.solarpanelmonitoringsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataDto {
    private String panelId;
    private double voltage;
    private double current;
    private double power;
    private double temperature;
    private double efficiency;
    private double rotationAngle; // (0-180 degrees)
    private LocalDateTime timestamp;
}