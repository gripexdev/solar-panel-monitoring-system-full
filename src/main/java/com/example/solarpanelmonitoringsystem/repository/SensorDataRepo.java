package com.example.solarpanelmonitoringsystem.repository;

import com.example.solarpanelmonitoringsystem.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorDataRepo extends JpaRepository<SensorData, Long> {
}
