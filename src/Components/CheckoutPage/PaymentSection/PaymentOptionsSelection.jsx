import { useTranslation } from "react-i18next";
import PaymentCards from "./PaymentCards";
import s from "./PaymentOptionsSelection.module.scss";

const PaymentOptionsSelection = ({ paymentType, setPaymentType, onMomoDirect }) => {
  const { t } = useTranslation();

  return (
    <div className={s.paymentOptions}>
      <div className={s.input}>
        <div className={s.wrapper}>
          <input
            type="radio"
            name="payment"
            value="bank"
            id="bank-option"
            checked={paymentType === "bank"}
            onChange={(e) => setPaymentType(e.target.value)}
            aria-checked={paymentType === "bank"}
            aria-labelledby="bank-label"
          />
          <label id="bank-label" htmlFor="bank-option">
            {t("bank")}
          </label>
        </div>

        <PaymentCards />
      </div>

      <div className={s.input}>
        <div className={s.wrapper}>
          <input
            type="radio"
            name="payment"
            value="cash"
            id="cash-option"
            checked={paymentType === "cash"}
            onChange={(e) => setPaymentType(e.target.value)}
            aria-checked={paymentType === "cash"}
            aria-labelledby="cash-label"
          />
          <label id="cash-label" htmlFor="cash-option">
            {t("cashOnDelivery")}
          </label>
        </div>
      </div>

      <div className={s.input}>
        <div className={s.wrapper}>
          <input
            type="radio"
            name="payment"
            value="momo"
            id="momo-option"
            checked={paymentType === "momo"}
            onChange={(e) => setPaymentType(e.target.value)}
            style={{ display: 'none' }} // Hide the radio button
          />
          <label 
            id="momo-label" 
            htmlFor="momo-option" 
            onClick={() => {
              setPaymentType("momo");
              onMomoDirect && onMomoDirect();
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              border: paymentType === 'momo' ? '2px solid #004691' : '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              gap: '12px',
              background: paymentType === 'momo' ? '#f0f7ff' : '#fff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: paymentType === 'momo' ? '0 4px 12px rgba(0, 70, 145, 0.08)' : 'none'
            }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #f1f5f9'
            }}>
              <img 
                src="https://vinadesign.vn/uploads/images/2023/05/logo-shinhan-bank-vinadesign-25-16-16-11.jpg" 
                alt="Shinhan Bank" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '0.95rem' }}>Chuyển khoản nhanh (VietQR)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsSelection;
