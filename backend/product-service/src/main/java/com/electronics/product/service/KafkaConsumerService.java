package com.electronics.product.service;

import com.electronics.product.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "order-events", groupId = "product-group")
    public void consumeOrderEvent(String message) {
        try {
            JsonNode root = objectMapper.readTree(message);
            JsonNode items = root.get("items");
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    Long productId = item.get("productId").asLong();
                    Integer quantity = item.get("quantity").asInt();

                    productRepository.findById(productId).ifPresent(product -> {
                        product.setStockQuantity(product.getStockQuantity() - quantity);
                        product.setSold(product.getSold() + quantity);
                        productRepository.save(product);
                        System.out.println("Updated product " + productId + ": stock=" + product.getStockQuantity()
                                + ", sold=" + product.getSold());
                    });
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing order event: " + e.getMessage());
            // If message is not JSON, it might be the old string format, skip or log
        }
    }
}
