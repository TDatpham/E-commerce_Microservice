import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { newSignUp, setLoginData } from "src/Features/userSlice";
import { authApi } from "src/Services/api";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import { loadUserProducts } from "src/Features/productsSlice";
import { loadUserData } from "src/Functions/userDataStorage";
import {
  compareDataToObjValue,
  getUniqueArrayByObjectKey,
} from "src/Functions/helper";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import SignUpButtons from "./SignUpButtons/SignUpButtons";
import s from "./SignUpForm.module.scss";
import SignUpFormInputs from "./SignUpFormInputs/SignUpFormInputs";

const SignUpForm = () => {
  const { signedUpUsers } = useSelector((state) => state.user);
  const isWebsiteOnline = useOnlineStatus();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function signUp(e) {
    e.preventDefault();

    const inputs = e.target.querySelectorAll("input");
    const formDataObj = new FormData(e.target);
    const formData = {};

    // Set keys and values from formDataObj to formData
    for (let pair of formDataObj.entries()) formData[pair[0]] = pair[1];

    const isFormValid = simpleValidationCheck(inputs);

    if (isFormValid) {
      if (!isWebsiteOnline) {
        internetConnectionAlert();
        return;
      }

      try {
        const identifier = formData.emailOrPhone;
        const isEmail = identifier.includes("@");
        
        const userData = {
          username: identifier,
          email: isEmail ? identifier : null,
          phone: !isEmail ? identifier : null,
          password: formData.password,
          fullName: formData.fullName || formData.name || "",
          role: formData.role || "USER"
        };
        
        const response = await authApi.register(userData);
        if (response.data) {
          // The backend returns AuthResponse (tokens + user)
          handleSuccessLogin(response.data);
          signInAlert(t, dispatch);
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        console.error("Registration failed:", error);
        const msg = error?.response?.data || "Registration failed. Please check your details.";
        dispatch(showAlert({ alertText: msg, alertState: "error", alertType: "alert" }));
      }
    }
  }

  const handleSuccessLogin = (data) => {
    dispatch(setLoginData(data));
    // Restore user-specific favorites and wishlist if any (usually empty for new users)
    const userId = data?.user?.id || data?.id;
    if (userId) {
      const favoritesProducts = loadUserData("favoritesProducts", userId);
      const wishList = loadUserData("wishList", userId);
      dispatch(loadUserProducts({ favoritesProducts, wishList }));
    }
  };

  function internetConnectionAlert() {
    const alertText = t("toastAlert.loginFailed");
    const alertState = "error";

    dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
  }

  return (
    <form action="POST" className={s.form} onSubmit={signUp}>
      <h2>{t("loginSignUpPage.createAccount")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <SignUpFormInputs />
      <SignUpButtons />
    </form>
  );
};
export default SignUpForm;

export function signInAlert(t, dispatch) {
  const alertText = t("toastAlert.signInSuccess");
  const alertState = "success";

  setTimeout(() => {
    dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
  }, 1500);
}
