import { useRef } from "react";
import { productsData } from "src/Data/productsData";
import useSlider from "src/Hooks/App/useSlider";
import ProductCard from "../../ProductsCards/ProductCard/ProductCard";
import s from "./ProductsSlider.module.scss";
import SliderButtons from "./SliderButtons/SliderButtons";

import useFetchProducts from "src/Hooks/App/useFetchProducts";

const ProductsSlider = ({
  filterFun,
  customization,
  loading,
}) => {
  const { products: backendProducts, loading: apiLoading } = useFetchProducts();
  const sliderRef = useRef();
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef);

  // If filterFun is provided, use it on data. Fallback to productsData for static compatibility or backendProducts
  const displayProducts = filterFun ? filterFun(backendProducts.length ? backendProducts : productsData) : (backendProducts.length ? backendProducts : productsData);

  if (apiLoading && !productsData.length) return <div>Loading products...</div>;

  return (
    <>
      <SliderButtons
        handleNextBtn={handleNextBtn}
        handlePrevBtn={handlePrevBtn}
      />

      <div className={s.productsSlider} ref={sliderRef} dir="ltr">
        {displayProducts.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            customization={customization}
            loading={loading}
          />
        ))}
      </div>
    </>
  );
};

export default ProductsSlider;
