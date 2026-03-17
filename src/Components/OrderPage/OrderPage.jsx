import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useFetchOrders from "src/Hooks/App/useFetchOrders";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import ForYouSection from "../Shared/Sections/ForYouSection/ForYouSection";
import OrderProducts from "./CartProducts/OrderProducts";
import s from "./OrderPage.module.scss";
import OrderPageButtons from "./OrderPageButtons/OrderPageButtons";

const OrderPage = () => {
  const { t } = useTranslation();
  const { orders: backendOrders } = useFetchOrders();
  const { orderProducts: localOrders } = useSelector((state) => state.products);

  useScrollOnMount(200);

  return (
    <div className="container">
      <main className={s.orderPage}>
        <PagesHistory history={["/", t("history.orders")]} />

        <div className={s.pageComponents} id="order-page">
          <OrderProducts />
          {/* Chỉ hiển thị nút nhận/hủy tất cả cho flow cũ dùng local orders (khi chưa có backend orders) */}
          {backendOrders.length === 0 && localOrders.length > 0 && (
            <OrderPageButtons />
          )}
          <ForYouSection />
        </div>
      </main>
    </div>
  );
};
export default OrderPage;
