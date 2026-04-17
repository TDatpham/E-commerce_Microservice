import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { orderApi, productApi } from "src/Services/api";
import s from "./MomoPaymentPage.module.scss";

const MomoPaymentPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(600);
  const [orderDetails, setOrderDetails] = useState(null);
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderApi.getById(orderId);
        const orderData = response.data;
        setOrderDetails(orderData);
        
        // Fetch product names for each item
        const names = {};
        if (orderData.items) {
          const productRequests = orderData.items.map(item => 
            productApi.getById(item.productId)
              .then(res => {
                names[item.productId] = res.data.name;
              })
              .catch(() => {
                names[item.productId] = `Product #${item.productId}`;
              })
          );
          await Promise.all(productRequests);
          setProductMap(names);
        }
      } catch (err) {
        console.error("Fetch order failed", err);
      }
    };
    fetchOrder();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [orderId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleConfirmPayment = async () => {
    try {
      await orderApi.updateStatus(orderId, "PAID");
      dispatch(showAlert({ alertText: "PAYMENT SUCCESSFUL!", alertState: "success", alertType: "alert" }));
      setTimeout(() => navigate("/order"), 2000);
    } catch (error) {
      dispatch(showAlert({ alertText: "ERROR CONFIRMING PAYMENT.", alertState: "error", alertType: "alert" }));
    }
  };

  const amountVnd = Math.round(parseFloat(amount) * 25000);
  const formattedAmount = amountVnd.toLocaleString("vi-VN");
  
  const bankId = "SHBVN";
  const accountNo = "0931274340";
  const accountName = "PHAM THANH DAT";
  const description = `ORDER_${orderId}`;
  const vietQrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amountVnd}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className={s.container}>
      <div className={s.paymentCard}>
        <header className={s.header}>
            <h1>QR CODE PAYMENT</h1>
            <div className={s.statusBadge}>
                <div className={s.dot} />
                AWAITING PAYMENT
            </div>
        </header>

        <div className={s.content}>
          <div className={s.qrSection}>
            <div className={s.qrContainer}>
              <img src={vietQrUrl} alt="QR Code" />
            </div>
          </div>

          <div className={s.detailsSection}>
            <div className={s.infoGroup}>
              <div className={s.infoItem}>
                <label>ACCOUNT HOLDER</label>
                <div className={s.value}>PHẠM THÀNH ĐẠT</div>
              </div>

              <div className={s.orderItems}>
                <label>PURCHASED ITEMS</label>
                <div className={s.itemList}>
                  {orderDetails?.items?.map((item, idx) => (
                    <div key={idx} className={s.itemRow}>
                      <span className={s.itemName}>
                        {productMap[item.productId] || "Loading..."} × {item.quantity}
                      </span>
                      <span className={s.itemPrice}>
                        {(item.price * 25000).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${s.infoItem} ${s.amountItem}`}>
                <label>TOTAL AMOUNT</label>
                <div className={s.value}>{formattedAmount} ₫</div>
              </div>
            </div>

            <div className={s.actions}>
              <button className={s.primaryBtn} onClick={handleConfirmPayment}>
                I HAVE COMPLETED THE TRANSFER
              </button>
              <button className={s.secondaryBtn} onClick={() => navigate("/checkout")}>
                CANCEL TRANSACTION
              </button>
            </div>
            
            <div className={s.timer}>
              TRANSACTION EXPIRES IN: <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomoPaymentPage;
