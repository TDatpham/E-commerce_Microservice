import { useTranslation } from "react-i18next";
import { billingInputsData } from "src/Data/staticData";
import BillingInput from "./BillingInput";
import s from "./BillingInputs.module.scss";

const ALLOWED_KEYS = [
  "Backspace", "Delete", "Tab", "Escape", "Enter",
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Home", "End",
];

const BillingInputs = ({ inputsData }) => {
  const { billingValues, handleChange } = inputsData;
  const { t } = useTranslation();

  function onPhoneKeyDown(event) {
    const isDigit = /^\d$/.test(event.key);
    const isAllowed = ALLOWED_KEYS.includes(event.key);
    const isCtrlAction = event.ctrlKey || event.metaKey; // allow Ctrl+A, Ctrl+C, etc.
    if (!isDigit && !isAllowed && !isCtrlAction) {
      event.preventDefault();
    }
  }

  return (
    <div className={s.inputs}>
      {billingInputsData.map(
        ({ translationKey, name, type, required, id }) => {
          const isPhone = name === "phoneNumber";
          const inputData = {
            value: billingValues[translationKey],
            name,
            label: t(`inputsLabels.${translationKey}`),
            required,
            type,
            onChange: handleChange,
            onKeyDown: isPhone ? onPhoneKeyDown : undefined,
          };

          return <BillingInput key={id} inputData={inputData} />;
        }
      )}
    </div>
  );
};
export default BillingInputs;
