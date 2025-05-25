package com.example.solarpanelmonitoringsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataDto {
    private boolean snow;
    private double windSpeed;
    private boolean rainDetected;
    private double switchState;
    private double radiation;
    private double pvAngle;
    private double humidity;
    private double temperature;
    private LocalDateTime timestamp;
}