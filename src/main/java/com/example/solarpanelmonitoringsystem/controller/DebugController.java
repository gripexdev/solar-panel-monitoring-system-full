package com.example.solarpanelmonitoringsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {
    @GetMapping("/debug")
    public String debug() {
        return "Debug endpoint is working!";
    }
} 