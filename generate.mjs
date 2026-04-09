import fs from 'fs';

const content = fs.readFileSync('src/Data/productsData.jsx', 'utf8');

// Quick and dirty extraction
let arrayStr = content.match(/export const productsData = (\[[\s\S]*?\]);\s*\n/);
if (!arrayStr) {
    console.log("Could not find productsData array");
    process.exit(1);
}

// remove variable refs using a hack
let jsStr = arrayStr[1].replace(/img: [a-zA-Z0-9_]+/g, (m) => `img: "${m.split(' ')[1]}"`);
jsStr = jsStr.replace(/otherImages: \[[^\]]+\]/g, 'otherImages: []');
// eval the array
const productsData = eval("(" + jsStr + ")");

let javaOutput = `package com.electronics.product;

import com.electronics.product.model.Product;
import com.electronics.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final ProductService productService;

    @Override
    public void run(String... args) {
        if (productService.getAllProducts().isEmpty()) {
`;

productsData.forEach((p, i) => {
    let colorsStr = (p.colors || []).map(c => `new com.electronics.product.model.ProductColor(null, "${c.name}", "${c.color}")`).join(', ');
    if (colorsStr.length > 0) {
        colorsStr = `java.util.List.of(${colorsStr})`;
    } else {
        colorsStr = `new java.util.ArrayList<>()`;
    }

    javaOutput += `
            Product p${i} = new Product();
            p${i}.setName("${p.name.replace(/"/g, '\\"')}");
            p${i}.setShortName("${(p.shortName || p.name).replace(/"/g, '\\"')}");
            p${i}.setCategory("${p.category}");
            p${i}.setBrand("${p.brand || 'No Brand'}");
            p${i}.setPrice(${p.price}D);
            p${i}.setDiscount(${p.discount || 0});
            p${i}.setDescription("${p.description.replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/"/g, '\\"').trim()}");
            p${i}.setAddedDate("${p.addedDate}");
            p${i}.setImg("${p.img}");
            p${i}.setRate(${p.rate || 5}D);
            p${i}.setVotes(${p.votes || 0});
            p${i}.setSold(${p.sold || 0});
            p${i}.setStockQuantity(100);
            p${i}.setStatus("APPROVED");
            p${i}.setColors(${colorsStr});
            productService.saveProduct(p${i});
`;
});

javaOutput += `
            System.out.println("Initialized sample products from frontend data.");
        }
    }
}
`;

fs.writeFileSync('backend/product-service/src/main/java/com/electronics/product/DataInitializer.java', javaOutput);
console.log("Written successfully.");
