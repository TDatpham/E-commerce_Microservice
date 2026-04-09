import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeById } from "src/Features/productsSlice";
import CustomNumberInput from "../../Shared/MiniComponents/CustomNumberInput/CustomNumberInput";
import s from "./CartProduct.module.scss";
import RemoveCartProductBtn from "./RemoveCartProductBtn";
import { translateProduct } from "src/Functions/componentsFunctions";

const CartProduct = ({ data }) => {
  const { img, name, shortName, afterDiscount, quantity, id } = data;
  const priceAfterDiscount = afterDiscount.replaceAll(",", "");
  const subTotal = (quantity * priceAfterDiscount).toFixed(2);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const translatedProductName = translateProduct({
    productName: shortName,
    translateMethod: t,
    translateKey: "shortName",
  });

  return (
    <tr className={s.productContainer}>
      <td className={s.product}>
        <div className={s.imgHolder}>
          <img src={img} alt={`${shortName} product`} />
          <RemoveCartProductBtn productId={id} />
        </div>

        <div className={s.productInfo}>
          <Link to={`/details?product=${name}`}>{translatedProductName}</Link>
          <button
            className={s.removeBtnText}
            onClick={() => dispatch(removeById({ key: "cartProducts", id: id }))}
          >
            {t("productCard.icons.remove")}
          </button>
        </div>
      </td>

      <td className={s.price}>${afterDiscount}</td>

      <td>
        <CustomNumberInput product={data} quantity={quantity} />
      </td>

      <td>${subTotal}</td>
    </tr>
  );
};
export default CartProduct;
