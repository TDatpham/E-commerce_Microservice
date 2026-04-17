package com.electronics.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MomoService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${momo.partnerCode:MOMOBKUN20180529}")
    private String partnerCode;

    @Value("${momo.accessKey:klm05TvNBqg7n6uD}")
    private String accessKey;

    @Value("${momo.secretKey:at67qH6mk8w5Y1n71ytrSPlS7hS6n9L}")
    private String secretKey;

    @Value("${momo.apiUrl:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String apiUrl;

    @Value("${momo.redirectUrl:http://localhost:5173/order}")
    private String redirectUrl;

    @Value("${momo.ipnUrl:http://localhost:8080/api/orders/payments/momo-callback}")
    private String ipnUrl;

    public Map<String, Object> createPayment(Long orderId, Double amount) throws Exception {
        String requestId = UUID.randomUUID().toString();
        String uniqueOrderId = orderId + "_" + System.currentTimeMillis();
        String orderInfo = "Order" + orderId; // Simplified, NO spaces, NO special chars
        String requestType = "captureWallet";
        String extraData = "";
        long amountLong = (long) (amount * 25000); 

        // Secret keys should be trimmed to avoid accidental white spaces in properties
        String secret = secretKey.trim();
        String access = accessKey.trim();
        String partner = partnerCode.trim();

        // Signature fields MUST be in alphabetical order
        String rawSignature = "accessKey=" + access +
                "&amount=" + amountLong +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + uniqueOrderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partner +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        System.out.println("[MoMo] Raw Signature: " + rawSignature);
        String signature = hmacSha256(rawSignature, secret);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("partnerCode", partner);
        requestBody.put("partnerName", "Electronics Store");
        requestBody.put("storeId", "MomoTestStore");
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amountLong);
        requestBody.put("orderId", uniqueOrderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", redirectUrl);
        requestBody.put("ipnUrl", ipnUrl);
        requestBody.put("lang", "vi");
        requestBody.put("extraData", extraData);
        requestBody.put("requestType", requestType);
        requestBody.put("signature", signature);

        System.out.println("[MoMo] Request to MoMo: " + requestBody);
        Map<String, Object> response = restTemplate.postForObject(apiUrl, requestBody, Map.class);
        System.out.println("[MoMo] Response: " + response);
        return response;
    }

    private String hmacSha256(String data, String key) throws Exception {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec signingKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return toHexString(rawHmac);
    }

    private String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
