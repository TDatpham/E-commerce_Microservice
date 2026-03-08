import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { authApi } from "src/Services/api";
import { signInAlert } from "../SignUpForm";
import s from "./SignUpButtons.module.scss";

const SignUpButtons = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await authApi.googleLogin(credentialResponse.credential);
      if (response.data) {
        dispatch(setLoginData(response.data));
        signInAlert(t, dispatch);
      }
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      dispatch(showAlert({ alertText: "Google Sign Up Failed", alertState: "error", alertType: "alert" }));
    }
  };

  return (
    <div className={s.buttons}>
      <button type="submit" className={s.createAccBtn}>
        {t("buttons.createAccount")}
      </button>

      <div className={s.googleBtnContainer}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Google Sign Up Failed')}
          text="signup_with"
        />
      </div>

      <p>
        <span>{t("loginSignUpPage.alreadyHaveAcc")}</span>
        <Link to="/login">{t("buttons.login")}</Link>
      </p>
    </div>
  );
};
export default SignUpButtons;
