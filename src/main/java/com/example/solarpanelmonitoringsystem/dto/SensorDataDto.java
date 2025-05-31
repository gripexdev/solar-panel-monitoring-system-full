package com.example.solarpanelmonitoringsystem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataDto {

    @JsonProperty("snow")
    private boolean snow;

    @JsonProperty("wind_speed")
    private double windSpeed;

    @JsonProperty("rain_detected")
    private boolean rainDetected;

    @JsonProperty("switch_state")
    private double switchState;

    @JsonProperty("radiation")
    private double radiation;

    @JsonProperty("pvAngle")
    private double pvAngle;

    @JsonProperty("humidity")
    private double humidity;

    @JsonProperty("temperature")
    private double temperature;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
}