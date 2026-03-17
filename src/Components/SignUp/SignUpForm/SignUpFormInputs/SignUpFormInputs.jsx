import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "src/Features/formsSlice";
import ShowHidePassword from "../../../Shared/MiniComponents/ShowHidePassword/ShowHidePassword";
import s from "./SignUpFormInputs.module.scss";

const SignUpFormInputs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { fullName, emailOrPhone, password, role } = useSelector(
    (state) => state.forms.signUp
  );

  function updateInputOnChange(e) {
    dispatch(
      updateInput({
        formName: "signUp",
        key: e.target.name,
        value: e.target.value,
      })
    );
  }

  return (
    <div className={s.inputs}>
      <input
        type="text"
        name="fullName"
        value={fullName}
        placeholder={t("inputsPlaceholders.fullName")}
        onChange={updateInputOnChange}
        required
        aria-required="true"
      />
      <input
        type="text"
        name="emailOrPhone"
        value={emailOrPhone}
        placeholder={t("inputsPlaceholders.emailOrPhone")}
        onChange={updateInputOnChange}
        required
        aria-required="true"
      />
      <div className={s.input}>
        <input
          type="password"
          name="password"
          value={password}
          placeholder={t("inputsPlaceholders.password")}
          onChange={updateInputOnChange}
          required
          aria-required="true"
        />
        <ShowHidePassword />
      </div>

      <div className={s.roleSelection}>
        <p>{t("loginSignUpPage.chooseRole") || "I want to join as a:"}</p>
        <div className={s.roles}>
          <label>
            <input
              type="radio"
              name="role"
              value="USER"
              checked={role === "USER"}
              onChange={updateInputOnChange}
            />
            <span>{t("loginSignUpPage.roleUser") || "User"}</span>
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="SELLER"
              checked={role === "SELLER"}
              onChange={updateInputOnChange}
            />
            <span>{t("loginSignUpPage.roleSeller") || "Seller"}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
export default SignUpFormInputs;
