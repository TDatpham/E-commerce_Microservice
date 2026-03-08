import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { newSignUp, setLoginData } from "src/Features/userSlice";
import { authApi } from "src/Services/api";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
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
        const userData = {
          username: formData.emailOrPhone, // Use email as username
          email: formData.emailOrPhone,
          password: formData.password,
          fullName: formData.fullName || formData.name || ""
        };
        const response = await authApi.register(userData);
        if (response.data) {
          dispatch(setLoginData(response.data));
          signInAlert(t, dispatch);
        }
      } catch (error) {
        console.error("Registration failed:", error);
        internetConnectionAlert(); // reuse error alert
      }
    }
  }

  function internetConnectionAlert() {
    const alertText = t("toastAlert.loginFailed");
    const alertState = "error";

    dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
  }

  return (
    <form action="GET" className={s.form} onSubmit={signUp}>
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
