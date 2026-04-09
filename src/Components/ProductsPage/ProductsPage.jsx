import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { SIMPLE_DELAYS } from "src/Data/globalVariables";
import { productCardCustomizations } from "src/Data/staticData";
import { updateLoadingState } from "src/Features/loadingSlice";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useUpdateLoadingState from "src/Hooks/App/useUpdateLoadingState";
import useFetchProducts from "src/Hooks/App/useFetchProducts";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import ProductCard from "../Shared/ProductsCards/ProductCard/ProductCard";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import s from "./ProductsPage.module.scss";

const ITEMS_PER_PAGE = 12;

const ProductsPage = () => {
  const { loadingProductsPage } = useSelector((state) => state.loading);
  const { products, loading: productsLoading } = useFetchProducts();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "default",
  });

  const [currentPage, setCurrentPage] = useState(1);

  useUpdateLoadingState({
    loadingState: loadingProductsPage,
    loadingKey: "loadingProductsPage",
    actionMethod: updateLoadingState,
    delays: SIMPLE_DELAYS,
    cleanFunction: () =>
      dispatch(updateLoadingState({ key: "loadingProductsPage", value: true })),
  });
  useScrollOnMount(200);

  const { availableCategories, availableBrands, availableColors, availableSizes } = useMemo(() => {
    const cats = new Set();
    const brands = new Set();
    const colors = new Map(); // Use map to store unique color objects by name
    const sizes = new Set();
    
    products.forEach(p => {
      if (p.category) cats.add(p.category);
      if (p.colors) {
        p.colors.forEach(c => {
          if (c.name) colors.set(c.name, c);
        });
      }
      if (p.sizes) {
        p.sizes.forEach(s => sizes.add(s));
      }
    });

    return {
      availableCategories: Array.from(cats).sort(),
      availableColors: Array.from(colors.values()).sort((a, b) => a.name.localeCompare(b.name)),
      availableSizes: Array.from(sizes).sort(),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;

      // Color filter
      if (filters.colors.length > 0) {
        const productColors = p.colors?.map(c => c.name) || [];
        if (!filters.colors.some(c => productColors.includes(c))) return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const productSizes = p.sizes || [];
        if (!filters.sizes.some(s => productSizes.includes(s))) return false;
      }

      // Price filter
      const price = parseFloat(p.afterDiscount);
      if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;

      return true;
    });

    // Sorting logic
    if (filters.sortBy === "priceLowHigh") {
      result.sort((a, b) => parseFloat(a.afterDiscount) - parseFloat(b.afterDiscount));
    } else if (filters.sortBy === "priceHighLow") {
      result.sort((a, b) => parseFloat(b.afterDiscount) - parseFloat(a.afterDiscount));
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => (b.rate || 0) - (a.rate || 0));
    } else if (filters.sortBy === "discount") {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return result;
  }, [products, filters]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = loadingProductsPage || productsLoading;

  return (
    <>
      <Helmet>
        <title>Products List</title>
        <meta name="description" content="Browse and filter our electronics collection." />
      </Helmet>

      <div className="container">
        <PagesHistory history={["/", t("history.products")]} />

        <main className={s.productsPage}>
          <FilterSidebar
            filters={filters}
            setFilters={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            categories={availableCategories}
            colors={availableColors}
            sizes={availableSizes}
          />

          <section className={s.productsColumn}>
            {isLoading ? (
              <div className={s.SkeletonCards}>
                <SkeletonCards numberOfCards={6} />
              </div>
            ) : (
              <>
                <div className={s.productsGrid}>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map(product => (
                      <ProductCard
                        product={product}
                        key={product.id}
                        customization={productCardCustomizations.allProducts}
                      />
                    ))
                  ) : (
                    <p className={s.noProducts}>No products match your filters.</p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className={s.pagination}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={s.pageBtn}
                    >
                      {t("productsPage.prev") || "Prev"}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`${s.pageBtn} ${currentPage === page ? s.active : ""}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={s.pageBtn}
                    >
                      {t("productsPage.next") || "Next"}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default ProductsPage;
