import * as ProductImages from "src/Assets/Products/ProductImgs";

export const getProductImage = (imageName) => {
  if (!imageName) return null;
  // If it's already a processed asset (from static data), return it
  if (typeof imageName !== "string") return imageName;
  // Full URL (backend image URL) – return as-is so images display correctly
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }
  // Try to find it in our imported assets, otherwise use as path/URL
  return ProductImages[imageName] || imageName;
};
