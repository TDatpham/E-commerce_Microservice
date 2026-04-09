import { useTranslation } from "react-i18next";
import { AVAILABLE_COLORS } from "src/Data/staticData";
import s from "./FilterSidebar.module.scss";

const FilterSidebar = ({
    filters,
    setFilters,
    categories = [],
    colors = [],  // Dynamic colors from current products
    sizes = [],
}) => {
    const { t } = useTranslation();

    const displayColors = AVAILABLE_COLORS; // Always show all 7 standard colors in filter

    const handleFilterChange = (key, value) => {
        const currentValues = filters[key] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setFilters({ ...filters, [key]: newValues });
    };

    const handleSingleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const resetFilters = () => {
        setFilters({
            categories: [],
            colors: [],
            sizes: [],
            minPrice: "",
            maxPrice: "",
            sortBy: "default",
        });
    };

    return (
        <aside className={s.sidebar}>
            <div className={s.sidebarHeader}>
                <h3>{t("productsPage.filterTitle") || "Filters"}</h3>
                <button className={s.resetBtn} onClick={resetFilters}>
                    {t("productsPage.resetFilters") || "Reset"}
                </button>
            </div>

            <div className={s.filterSection}>
                <h4>{t("productsPage.sortBy") || "Sort By"}</h4>
                <select name="sortBy" value={filters.sortBy} onChange={handleSingleChange} className={s.selectInput}>
                    <option value="default">{t("productsPage.sortDefault") || "Default"}</option>
                    <option value="priceLowHigh">{t("productsPage.sortPriceLowHigh") || "Price: Low to High"}</option>
                    <option value="priceHighLow">{t("productsPage.sortPriceHighLow") || "Price: High to Low"}</option>
                    <option value="rating">{t("productsPage.sortRating") || "Rating"}</option>
                    <option value="discount">{t("productsPage.sortDiscount") || "Discount"}</option>
                </select>
            </div>

            <div className={s.filterSection}>
                <h4>{t("productsPage.filterPrice") || "Price Range"}</h4>
                <div className={s.priceRange}>
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleSingleChange}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleSingleChange}
                    />
                </div>
            </div>

            <div className={s.filterSection}>
                <h4>{t("productsPage.filterCategory") || "Categories"}</h4>
                <div className={s.checkList}>
                    {categories.map((cat) => (
                        <label key={cat} className={s.checkItem}>
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(cat)}
                                onChange={() => handleFilterChange('categories', cat)}
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={s.filterSection}>
                <h4>{t("productsPage.filterColor") || "Colors"}</h4>
                <div className={s.colorList}>
                    {displayColors.map((color) => (
                        <button
                            key={color.name}
                            title={color.name}
                            className={`${s.colorBtn} ${filters.colors.includes(color.name) ? s.activeColor : ""}`}
                            style={{ backgroundColor: color.color }}
                            onClick={() => handleFilterChange('colors', color.name)}
                        />
                    ))}
                </div>
            </div>

            {sizes.length > 0 && (
                <div className={s.filterSection}>
                    <h4>{t("productsPage.filterSize") || "Sizes"}</h4>
                    <div className={s.sizeList}>
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`${s.sizeBtn} ${filters.sizes.includes(size) ? s.activeSize : ""}`}
                                onClick={() => handleFilterChange('sizes', size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default FilterSidebar;
