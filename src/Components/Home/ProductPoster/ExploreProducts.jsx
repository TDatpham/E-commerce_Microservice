import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard";
import s from "./ExploreProducts.module.scss";
import useFetchProducts from "src/Hooks/App/useFetchProducts";
import { productsData as staticProducts } from "src/Data/productsData";

const ExploreProducts = ({ numOfProducts = -1, customization }) => {
  const { products: backendProducts, loading } = useFetchProducts();
  const source = backendProducts.length ? backendProducts : staticProducts;
  const filteredProducts =
    numOfProducts >= 0 ? source.slice(0, numOfProducts) : source;

  if (loading && !source.length) return <div>Loading products...</div>;

  return (
    <div className={s.products}>
      {filteredProducts.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          customization={customization}
        />
      ))}
    </div>
  );
};
export default ExploreProducts;
