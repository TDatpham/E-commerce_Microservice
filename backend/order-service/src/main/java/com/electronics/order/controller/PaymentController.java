package com.electronics.order.controller;

import com.electronics.order.service.MomoService;
import com.electronics.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final MomoService momoService;
    private final OrderService orderService;

    @PostMapping("/momo/{orderId}")
    public ResponseEntity<?> createMomoPayment(@PathVariable Long orderId, @RequestBody Map<String, Double> payload) {
        try {
            Double amount = payload.get("amount");
            Map<String, Object> result = momoService.createPayment(orderId, amount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating MoMo payment: " + e.getMessage());
        }
    }

    @PostMapping("/momo-callback")
    public ResponseEntity<?> momoCallback(@RequestBody Map<String, Object> payload) {
        System.out.println("[MomoCallback] Received: " + payload);
        
        Integer resultCode = (Integer) payload.get("resultCode");
        String uniqueOrderId = (String) payload.get("orderId");
        
        if (resultCode != null && resultCode == 0 && uniqueOrderId != null) {
            String orderIdStr = uniqueOrderId.split("_")[0];
            Long orderId = Long.parseLong(orderIdStr);
            orderService.updateStatus(orderId, "PAID");
            System.out.println("[MomoCallback] Order " + orderId + " updated to PAID");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestParam String orderId, @RequestParam Integer resultCode) {
        // orderId here from frontend is already the original ID, but just in case
        String orderIdStr = orderId.split("_")[0];
        if (resultCode != null && resultCode == 0) {
            orderService.updateStatus(Long.parseLong(orderIdStr), "PAID");
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified."));
        }
        return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Payment failed."));
    }
}
