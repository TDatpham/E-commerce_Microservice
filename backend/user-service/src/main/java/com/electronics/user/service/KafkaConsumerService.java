package com.electronics.user.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "order-events", groupId = "user-group")
    public void consumeOrderEvent(String message) {
        System.out.println("User Service received order event: " + message);
        // Add logic to notify user or update points, etc.
    }
}
