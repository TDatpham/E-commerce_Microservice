import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice";
import { orderApi, default as api } from "src/Services/api";
import { store } from "src/App/store";
import { clearCart } from "src/Features/productsSlice";
import {
  blurInputs,
  isCheckoutFormValid,
  showInvalidInputAlert,
} from "src/Functions/componentsFunctions";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useFormData from "src/Hooks/Helper/useFormData";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import BillingDetails from "./BillingDetails/BillingDetails";
import { useState } from "react";
import s from "./CheckoutPage.module.scss";
import PaymentSection from "./PaymentSection/PaymentSection";

const CheckoutPage = () => {
  useScrollOnMount(160);
  const [paymentType, setPaymentType] = useState("bank");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveBillingInfoToLocal, cartProducts } = useSelector(
    (state) => state.products
  );
  const { values: billingValues, handleChange } = useFormData({
    initialValues: {
      firstName: "",
      companyName: "",
      streetAddress: "",
      address: "", // Mapping to apartment/address in staticData
      cityOrTown: "",
      phoneNumber: "",
      email: "",
    },
    onSubmit: handleSubmitPayment,
    storeInLocalStorage: saveBillingInfoToLocal,
    localStorageKey: "billingInfo",
  });

  const pageHistory = [t("history.account"), t("history.checkout")];
  const historyPaths = [
    {
      index: 0,
      path: "/profile",
    },
  ];

  async function handleSubmitPayment(event) {
    const isCheckboxFocused = document.activeElement.id === "save-info";
    const isInputFocused = document.activeElement.tagName === "INPUT";
    const inputs = event.target.querySelectorAll("input");
    const isCartEmpty = cartProducts.length === 0;
    const isFormValid = isCheckoutFormValid(event);

    event.preventDefault();
    blurInputs(inputs);
    showInvalidInputAlert(event);
    if (!saveBillingInfoToLocal) localStorage.removeItem("billingInfo");

    if (isInputFocused && isCheckboxFocused) return;
    
    // Bypass validation if paying with MoMo (user request for quick testing)
    if (!isFormValid && paymentType !== "momo") {
      console.log("Form invalid, inputs:", inputs);
      dispatch(showAlert({ alertText: "Please fill in all required fields correctly.", alertState: "warning", alertType: "alert" }));
      return;
    }

    if (isCartEmpty) {
      showEmptyCartAlert(dispatch, t);
      return;
    }

    try {
      const { loginInfo } = store.getState().user;
      if (!loginInfo?.isSignIn || !loginInfo?.id) {
        dispatch(
          showAlert({
            alertText: "Please sign in again to place your order.",
            alertState: "error",
            alertType: "alert",
          })
        );
        return;
      }
      const orderData = {
        userId: loginInfo.id,
        totalAmount: cartProducts.reduce((acc, p) => {
          const price = typeof p.afterDiscount === 'string'
            ? parseFloat(p.afterDiscount.replaceAll(",", ""))
            : p.afterDiscount;
          return acc + (price * p.quantity);
        }, 0),
        paymentMethod: paymentType,
        items: cartProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          price: typeof p.afterDiscount === 'string'
            ? parseFloat(p.afterDiscount.replaceAll(",", ""))
            : p.afterDiscount
        }))
      };

      dispatch(showAlert({ alertText: "Placing your order...", alertState: "info", alertType: "alert" }));
      const response = await orderApi.create(orderData);
      const createdOrder = response.data;

      if (paymentType === "momo") {
        dispatch(clearCart());
        dispatch(showAlert({ alertText: "Redirecting to Payment Page...", alertState: "info", alertType: "alert" }));
        console.log("[BankTransfer] Redirecting to payment page for order:", createdOrder.id);
        navigate(`/momo-payment/${createdOrder.id}?amount=${orderData.totalAmount}`);
        return;
      }

      // Clear cart only (orders are per-account and loaded from backend)
      dispatch(clearCart());

      dispatch(
        showAlert({
          alertState: "success",
          alertText: t("toastAlert.checkoutSuccess"),
          alertType: "alert",
        })
      );

      // Redirect after a small delay
      setTimeout(() => navigate("/order"), 1500);
    } catch (error) {
      console.error("Order failed:", error);
      dispatch(showAlert({ alertText: "Failed to place order. Please try again.", alertState: "error", alertType: "alert" }));
    }
  }

  async function handleMomoDirectPayment() {
    console.log("[MoMo] Direct payment triggered");
    
    if (cartProducts.length === 0) {
      showEmptyCartAlert(dispatch, t);
      return;
    }

    try {
      const { loginInfo } = store.getState().user;
      if (!loginInfo?.isSignIn || !loginInfo?.id) {
        dispatch(showAlert({ alertText: t("loginSignUpPage.pleaseSignIn"), alertState: "error", alertType: "alert" }));
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      setPaymentType("momo");
      dispatch(showAlert({ alertText: "Quick Checkout (Bank Transfer)...", alertState: "info", alertType: "alert" }));

      const orderData = {
        userId: loginInfo.id,
        totalAmount: cartProducts.reduce((acc, p) => {
          const price = typeof p.afterDiscount === 'string'
            ? parseFloat(p.afterDiscount.replaceAll(",", ""))
            : p.afterDiscount;
          return acc + (price * p.quantity);
        }, 0),
        paymentMethod: "Bank Transfer (Shinhan)",
        items: cartProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          price: typeof p.afterDiscount === 'string'
            ? parseFloat(p.afterDiscount.replaceAll(",", ""))
            : p.afterDiscount
        }))
      };

      const response = await orderApi.create(orderData);
      const createdOrder = response.data;

      console.log("[BankTransfer] Redirecting to local payment page for order:", createdOrder.id);
      dispatch(clearCart());
      navigate(`/momo-payment/${createdOrder.id}?amount=${orderData.totalAmount}`);
    } catch (error) {
      console.error("Direct payment failed:", error);
      dispatch(showAlert({ alertText: "Checkout failed. Check console.", alertState: "error", alertType: "alert" }));
    }
  }

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <meta
          name="description"
          content="Complete your purchase on Exclusive by reviewing your cart, adding your shipping details, and choosing payment options such as cash or bank card for a smooth checkout experience."
        />
      </Helmet>

      <div className="container">
        <main className={s.checkoutPage} id="checkout-page">
          <PagesHistory history={pageHistory} historyPaths={historyPaths} />

          <form
            method="POST"
            className={s.checkoutPageContent}
            onSubmit={handleSubmitPayment}
          >
            <BillingDetails inputsData={{ billingValues, handleChange }} />
            <PaymentSection 
              paymentType={paymentType} 
              setPaymentType={setPaymentType} 
              onMomoDirect={handleMomoDirectPayment}
            />
          </form>
        </main>
      </div>
    </>
  );
};
export default CheckoutPage;

function showEmptyCartAlert(dispatch, t) {
  dispatch(
    showAlert({
      alertState: "warning",
      alertText: t("toastAlert.cartEmpty"),
      alertType: "alert",
    })
  );
}
