package com.electronics.product.service;

import com.electronics.product.model.Product;
import com.electronics.product.model.Category;
import com.electronics.product.repository.ProductRepository;
import com.electronics.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDetails.getName());
        product.setShortName(productDetails.getShortName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setDiscount(productDetails.getDiscount());
        product.setCategory(productDetails.getCategory());
        product.setImg(productDetails.getImg());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setRate(productDetails.getRate());
        product.setVotes(productDetails.getVotes());
        product.setQuantity(productDetails.getQuantity());
        product.setSold(productDetails.getSold());

        return productRepository.save(product);
    }

    public List<Product> getTopSellingProducts() {
        return productRepository.findTop5ByOrderBySoldDesc();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Categories
    public java.util.List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(categoryDetails.getName());
        category.setDisplayName(categoryDetails.getDisplayName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
