import * as ProductImages from "src/Assets/Products/ProductImgs";

export const getProductImage = (imageName) => {
    if (!imageName) return null;
    // If it's already a processed asset (from static data), return it
    if (typeof imageName !== 'string') return imageName;

    // Otherwise, try to find it in our imported images
    return ProductImages[imageName] || imageName;
};
