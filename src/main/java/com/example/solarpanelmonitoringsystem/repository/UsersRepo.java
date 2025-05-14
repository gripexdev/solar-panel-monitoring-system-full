package com.example.solarpanelmonitoringsystem.repository;

import com.example.solarpanelmonitoringsystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepo extends JpaRepository<OurUsers, Long> {
    boolean existsByEmail(String email);
    OurUsers findByEmail(String email);
}
