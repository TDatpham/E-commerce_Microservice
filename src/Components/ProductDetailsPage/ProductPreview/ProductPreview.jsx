import { useDispatch, useSelector } from "react-redux";
import { updateGlobalState } from "src/Features/globalSlice";
import { getProductImage } from "src/Functions/imageHelper";
import PreviewImages from "./ProductImages/PreviewImages";
import s from "./ProductPreview.module.scss";

const ProductPreview = ({ productData, handleZoomInEffect }) => {
  const { previewImg } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { name, otherImages, img } = productData;
  const hasImages = (otherImages?.length > 0) || img;
  const mainImgSrc = previewImg || getProductImage(img) || getProductImage(productData?.img);

  function setZoomInPreview(value = false) {
    dispatch(updateGlobalState({ key: "isZoomInPreviewActive", value: value }));
  }

  return (
    <section className={s.images}>
      {hasImages && <PreviewImages productData={productData} />}

      <div className={s.previewImgHolder}>
        {mainImgSrc ? (
          <img
            src={mainImgSrc}
            alt={name || "Product"}
            onMouseMove={handleZoomInEffect}
            onMouseEnter={() => setZoomInPreview(true)}
            onMouseLeave={() => setZoomInPreview(false)}
            className={s.mainPreviewImg}
          />
        ) : (
          <div className={s.placeholderImg}>No image</div>
        )}
      </div>
    </section>
  );
};
export default ProductPreview;
