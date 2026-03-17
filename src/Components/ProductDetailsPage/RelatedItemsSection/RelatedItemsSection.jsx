import { useTranslation } from "react-i18next";
import { productsData } from "src/Data/productsData";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import s from "./RelatedItemsSection.module.scss";

const RelatedItemsSection = ({ productType, currentProduct, allProducts }) => {
  const { t } = useTranslation();
  const relatedProducts = getProductsByRelatedType(allProducts);
  const hasRelatedProducts = relatedProducts.length > 0;

  function getProductsByRelatedType(dataToFilter) {
    const data = (Array.isArray(dataToFilter) && dataToFilter.length > 0) ? dataToFilter : productsData;
    return data.filter((product) => {
      const isSameType = (product.category || "").toLowerCase() === (productType || "").toLowerCase();
      const isCurrentProduct = String(product.id) === String(currentProduct?.id);
      return isSameType && !isCurrentProduct;
    });
  }

  return (
    <section className={s.section}>
      <SectionTitle type={2} eventName={t("detailsPage.relatedItems")} />

      {!hasRelatedProducts && <p>No related items were found.</p>}

      <ProductsSlider filterFun={getProductsByRelatedType} />
    </section>
  );
};
export default RelatedItemsSection;
