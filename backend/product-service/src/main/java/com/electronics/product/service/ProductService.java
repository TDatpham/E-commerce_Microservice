package com.electronics.product.service;

import com.electronics.product.model.Product;
import com.electronics.product.model.Category;
import com.electronics.product.model.Review;
import com.electronics.product.repository.ProductRepository;
import com.electronics.product.repository.CategoryRepository;
import com.electronics.product.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review addReview(Review review) {
        if (review.getDate() == null) {
            review.setDate(java.time.LocalDateTime.now());
        }
        Review savedReview = reviewRepository.save(review);
        updateProductRating(review.getProductId());
        return savedReview;
    }

    public Review updateReview(Long id, Review newReviewData) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setRating(newReviewData.getRating());
        review.setComment(newReviewData.getComment());
        Review saved = reviewRepository.save(review);
        updateProductRating(review.getProductId());
        return saved;
    }

    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Long productId = review.getProductId();
        reviewRepository.deleteById(id);
        updateProductRating(productId);
    }

    private void updateProductRating(Long productId) {
        productRepository.findById(productId).ifPresent(product -> {
            List<Review> reviews = reviewRepository.findByProductId(productId);
            if (reviews.isEmpty()) {
                product.setVotes(0);
                product.setRate(0.0);
            } else {
                double avg = reviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);
                product.setVotes(reviews.size());
                product.setRate(avg);
            }
            productRepository.save(product);
        });
    }

    public List<Product> getAllProducts() {
        return productRepository.findByStatus("APPROVED");
    }

    public List<Product> getProductsByStatus(String status) {
        return productRepository.findByStatus(status);
    }

    public List<Product> getProductsBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product saveProduct(Product product) {
        if (product.getAddedDate() == null || product.getAddedDate().isEmpty()) {
            product.setAddedDate(java.time.LocalDateTime.now().toString());
        }
        if (product.getRate() == null) product.setRate(0.0);
        if (product.getVotes() == null) product.setVotes(0);
        if (product.getQuantity() == null) product.setQuantity(1);
        if (product.getSold() == null) product.setSold(0);
        if (product.getStockQuantity() == null) product.setStockQuantity(50);
        if (product.getStatus() == null || product.getStatus().isEmpty()) {
            product.setStatus("PENDING");
        }
        return productRepository.save(product);
    }

    @org.springframework.transaction.annotation.Transactional
    public void reduceStock(java.util.List<java.util.Map<String, Object>> items) {
        for (java.util.Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("productId").toString());
            Integer quantity = Integer.valueOf(item.get("quantity").toString());

            productRepository.findById(productId).ifPresent(product -> {
                int currentStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 50;
                int currentSold = (product.getSold() != null) ? product.getSold() : 0;
                product.setStockQuantity(Math.max(0, currentStock - quantity));
                product.setSold(currentSold + quantity);
                productRepository.save(product);
            });
        }
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productDetails.getName() != null) product.setName(productDetails.getName());
        if (productDetails.getShortName() != null) product.setShortName(productDetails.getShortName());
        if (productDetails.getDescription() != null) product.setDescription(productDetails.getDescription());
        if (productDetails.getPrice() != null) product.setPrice(productDetails.getPrice());
        if (productDetails.getDiscount() != null) product.setDiscount(productDetails.getDiscount());
        if (productDetails.getCategory() != null) product.setCategory(productDetails.getCategory());
        if (productDetails.getImg() != null) product.setImg(productDetails.getImg());
        if (productDetails.getStockQuantity() != null) product.setStockQuantity(productDetails.getStockQuantity());
        
        // Don't overwrite stats with nulls if they weren't provided in the update request
        if (productDetails.getRate() != null) product.setRate(productDetails.getRate());
        if (productDetails.getVotes() != null) product.setVotes(productDetails.getVotes());
        if (productDetails.getQuantity() != null) product.setQuantity(productDetails.getQuantity());
        if (productDetails.getSold() != null) product.setSold(productDetails.getSold());
        
        if (productDetails.getStatus() != null) product.setStatus(productDetails.getStatus());
        if (productDetails.getSellerId() != null) product.setSellerId(productDetails.getSellerId());

        if (productDetails.getOtherImages() != null) product.setOtherImages(productDetails.getOtherImages());
        if (productDetails.getColors() != null) product.setColors(productDetails.getColors());
        if (productDetails.getSizes() != null) product.setSizes(productDetails.getSizes());

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
