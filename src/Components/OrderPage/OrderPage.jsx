import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import api from "src/Services/api";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useFetchOrders from "src/Hooks/App/useFetchOrders";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import ForYouSection from "../Shared/Sections/ForYouSection/ForYouSection";
import OrderProducts from "./CartProducts/OrderProducts";
import s from "./OrderPage.module.scss";
import OrderPageButtons from "./OrderPageButtons/OrderPageButtons";

const OrderPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { orders: backendOrders, refetch } = useFetchOrders();
  const { orderProducts: localOrders } = useSelector((state) => state.products);

  useScrollOnMount(200);

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const orderId = searchParams.get("orderId");

    if (resultCode && orderId) {
      if (resultCode === "0") {
        // Verify with backend because IPN might not reach localhost
        api.get(`/orders/payments/verify`, {
          params: { orderId, resultCode: parseInt(resultCode) }
        }).then(() => {
          dispatch(showAlert({
            alertText: "Payment successful! Your order is being processed.",
            alertState: "success",
            alertType: "alert"
          }));
          refetch(); // Reload orders to show "PAID" status
        }).catch(err => {
            console.error("Verification failed:", err);
        });
      } else {
        dispatch(showAlert({
          alertText: "Payment failed or was cancelled.",
          alertState: "error",
          alertType: "alert"
        }));
      }
    }
  }, [searchParams, dispatch, refetch]);

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
