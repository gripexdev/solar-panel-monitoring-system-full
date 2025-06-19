package com.example.solarpanelmonitoringsystem.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity @Getter
@Setter
@ToString
@RequiredArgsConstructor
public class SensorData {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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
