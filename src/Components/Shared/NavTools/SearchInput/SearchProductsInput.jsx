import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { productsData } from "src/Data/productsData";
import { updateLoadingState } from "src/Features/loadingSlice";
import { updateProductsState } from "src/Features/productsSlice";
import { searchByObjectKey } from "src/Functions/helper";
import SvgIcon from "../../MiniComponents/SvgIcon";
import SearchInput from "./SearchInput";
import s from "./SearchProductsInput.module.scss";
import useFetchProducts from "src/Hooks/App/useFetchProducts";

const SearchProductsInput = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const searchRef = useRef("");
  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: backendProducts } = useFetchProducts();

  function handleSearchProducts(e) {
    const queryValue = searchRef.current.value || searchRef.current;
    setSearchParams({ query: queryValue });
    e.preventDefault();

    const isEmptyQuery = queryValue?.trim()?.length === 0;
    if (isEmptyQuery) return;

    updateSearchProducts(queryValue);
  }

  function updateSearchProducts(explicitQuery) {
    dispatch(updateLoadingState({ key: "loadingSearchProducts", value: true }));

    const queryValue = explicitQuery || searchRef.current?.value || searchRef.current || searchParams.get("query");
    const isEmptyQuery = !queryValue || queryValue?.trim()?.length === 0;

    if (isEmptyQuery) {
      dispatch(updateProductsState({ key: "searchProducts", value: [] }));
      return;
    }

    const allProducts = backendProducts.length > 0 ? backendProducts : productsData;
    const productsFound = getProducts(queryValue, allProducts);

    dispatch(
      updateProductsState({ key: "searchProducts", value: productsFound })
    );
    navigateTo("/search?query=" + queryValue);
  }

  useEffect(() => {
    const isSearchPage = pathName === "/search";
    if (isSearchPage) updateSearchProducts();

    return () => {
      dispatch(
        updateLoadingState({ key: "loadingSearchProducts", value: true })
      );
    };
  }, [backendProducts, pathName]);

  return (
    <form
      className={s.searchContainer}
      onSubmit={handleSearchProducts}
      onClick={focusInput}
      role="search"
    >
      <SearchInput searchRef={searchRef} />

      <button type="submit" aria-label={t("tooltips.searchButton")}>
        <SvgIcon name="search" />
      </button>
    </form>
  );
};

export default SearchProductsInput;

function focusInput(e) {
  const searchInput = e.currentTarget.querySelector("#search-input");
  searchInput.focus();
}

function getProducts(query, data) {
  let productsFound = searchByObjectKey({
    data,
    key: "shortName",
    query,
  });

  if (productsFound.length === 0) {
    productsFound = searchByObjectKey({
      data,
      key: "category",
      query,
    });
  }

  return productsFound;
}
