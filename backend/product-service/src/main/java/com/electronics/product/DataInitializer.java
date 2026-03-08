package com.electronics.product;

import com.electronics.product.model.Product;
import com.electronics.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final ProductService productService;

    @Override
    public void run(String... args) {
        if (productService.getAllProducts().isEmpty()) {
            Product p1 = new Product();
            p1.setName("PS5 Gamepad");
            p1.setShortName("PS5 Gamepad");
            p1.setCategory("gaming");
            p1.setPrice(69.99);
            p1.setDiscount(40);
            p1.setDescription("PlayStation 5 Controller Skin High quality vinyl...");
            p1.setAddedDate("2024/2/2");
            p1.setImg("ps5Gamepad");
            p1.setRate(5.0);
            p1.setVotes(88);
            p1.setQuantity(1);
            p1.setSold(105);
            productService.saveProduct(p1);

            Product p2 = new Product();
            p2.setName("AK-900 Wired Keyboard");
            p2.setShortName("AK-9000 Keyboard");
            p2.setCategory("gaming");
            p2.setPrice(8.66);
            p2.setDiscount(35);
            p2.setDescription("Elevate your gaming experience with the AK-900 Wired Keyboard...");
            p2.setAddedDate("2024/2/7");
            p2.setImg("wiredKeyboard");
            p2.setRate(4.0);
            p2.setVotes(75);
            p2.setQuantity(1);
            p2.setSold(210);
            productService.saveProduct(p2);
            
            System.out.println("Initialized sample products.");
        }
    }
}
