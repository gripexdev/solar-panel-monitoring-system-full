package com.example.solarpanelmonitoringsystem.dto;

import lombok.Data;

@Data
public class ControlCommandDto {
    private String mode;  // "MANUAL", "AUTOTRACK", "SAFETY"
    private Double targetAngle;  // Only used in MANUAL mode
    private boolean emergencyStop;
}
