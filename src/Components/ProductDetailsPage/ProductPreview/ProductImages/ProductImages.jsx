import { useDispatch, useSelector } from "react-redux";
import { getProductImage } from "src/Functions/imageHelper";
import s from "./ProductImages.module.scss";

const ProductImages = ({ img, productData, index, setPreviewImg }) => {
  const { previewImg } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const resolvedImg = getProductImage(img);
  const activeClass = previewImg === resolvedImg ? s.active : "";
  const { shortName } = productData || {};

  return (
    <button
      type="button"
      className={`${s.imgHolder} ${activeClass}`}
      onClick={() => setPreviewImg && setPreviewImg(img, dispatch)}
    >
      <img src={resolvedImg} alt={`${shortName || "Product"} thumbnail ${index + 1}`} />
    </button>
  );
};
export default ProductImages;
