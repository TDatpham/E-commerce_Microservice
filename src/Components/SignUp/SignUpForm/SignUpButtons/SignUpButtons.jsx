import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { loadUserProducts } from "src/Features/productsSlice";
import { loadUserData } from "src/Functions/userDataStorage";
import { authApi } from "src/Services/api";
import { signInAlert } from "../SignUpForm";
import s from "./SignUpButtons.module.scss";

const SignUpButtons = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        dispatch(
          showAlert({
            alertText: "Google did not return a valid token. Please try again.",
            alertState: "error",
            alertType: "alert",
          })
        );
        return;
      }

      const response = await authApi.googleLogin(idToken);
      if (response.data) {
        handleSuccessLogin(response.data);
        signInAlert(t, dispatch);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      const msg = error?.response?.data || "Google Sign Up Failed. Please try again.";
      dispatch(showAlert({ alertText: msg, alertState: "error", alertType: "alert" }));
    }
  };

  const handleSuccessLogin = (data) => {
    dispatch(setLoginData(data));
    const userId = data?.user?.id || data?.id;
    if (userId) {
      const favoritesProducts = loadUserData("favoritesProducts", userId);
      const wishList = loadUserData("wishList", userId);
      dispatch(loadUserProducts({ favoritesProducts, wishList }));
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
          onError={() =>
            dispatch(
              showAlert({
                alertText: "Google Sign Up Failed. Please try again.",
                alertState: "error",
                alertType: "alert",
              })
            )
          }
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
