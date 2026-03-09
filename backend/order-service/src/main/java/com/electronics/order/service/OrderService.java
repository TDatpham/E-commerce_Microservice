package com.electronics.order.service;

import com.electronics.order.model.Order;
import com.electronics.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final KafkaProducerService kafkaProducerService;
    private final ObjectMapper objectMapper;

    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);
        try {
            String orderJson = objectMapper.writeValueAsString(savedOrder);
            kafkaProducerService.sendOrderMessage(orderJson);
        } catch (Exception e) {
            System.err.println("Failed to send order event: " + e.getMessage());
        }
        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    /** Admin: fetch all orders in the system. */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /** Admin: update the status of an order. */
    public Order updateStatus(Long id, String status) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
