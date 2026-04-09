import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateGlobalState } from "src/Features/globalSlice";
import { getProductImage } from "src/Functions/imageHelper";
import s from "./PreviewImages.module.scss";
import ProductImages from "./ProductImages";
import { setPreviewImg } from "src/Functions/imageHelper";

const PreviewImages = ({ productData }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const images =
    productData?.otherImages?.length > 0
      ? productData.otherImages
      : productData?.img
        ? [productData.img]
        : [];

  useEffect(() => {
    if (images.length > 0) {
      const firstImg = getProductImage(images[0]);
      dispatch(updateGlobalState({ key: "previewImg", value: firstImg }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, productData?.id]);

  if (images.length === 0) return null;

  return (
    <div className={s.otherImages}>
      {images.map((img, i) => (
        <ProductImages
          key={i}
          img={img}
          productData={productData}
          index={i}
          setPreviewImg={setPreviewImg}
        />
      ))}
    </div>
  );
};

export default PreviewImages;
