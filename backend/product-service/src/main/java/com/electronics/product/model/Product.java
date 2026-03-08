package com.electronics.product.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String shortName;
    @Column(length = 1000)
    private String description;
    private Double price;
    private Integer discount;
    private String category;
    private String img;
    private String addedDate;
    private Integer stockQuantity;

    @ElementCollection
    private List<String> otherImages;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ProductColor> colors;

    @ElementCollection
    private List<String> sizes;

    private Double rate;
    private Integer votes;
    private Integer quantity;
    private Integer sold;
}
