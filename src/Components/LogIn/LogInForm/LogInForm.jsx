import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { loadUserProducts } from "src/Features/productsSlice";
import { loadUserData } from "src/Functions/userDataStorage";
import { authApi } from "src/Services/api";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import s from "./LogInForm.module.scss";
import LogInFormInputs from "./LogInFormInputs/LogInFormInputs";

// view modes
const VIEW = { LOGIN: "login", OTP: "otp", FORGOT: "forgot", RESET: "reset" };

const LogInForm = () => {
  const { emailOrPhone, password } = useSelector((state) => state.forms.login);
  const [view, setView] = useState(VIEW.LOGIN);
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isWebsiteOnline = useOnlineStatus();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (!isWebsiteOnline) { internetConnectionAlert(dispatch, t); return; }

    setLoading(true);
    try {
      if (view === VIEW.LOGIN) {
        const inputs = e.target.querySelectorAll("input");
        const isFormValid = simpleValidationCheck(inputs);
        if (!isFormValid) { setLoading(false); return; }
        
        const response = await authApi.login({ username: emailOrPhone, password });
        if (response.data) handleSuccessLogin(response.data);
      } else if (view === VIEW.OTP) {
        await verifyLoginOtp();
      } else if (view === VIEW.FORGOT) {
        await sendForgotOtp();
      } else if (view === VIEW.RESET) {
        await resetPassword();
      }
    } catch (error) {
      let alertText = "Invalid email or password";
      if (!error.response) {
        alertText = "Cannot connect to server. Please make sure the backend is running.";
      } else if (error.response?.data) {
        alertText = typeof error.response.data === "string" ? error.response.data : "Invalid email or password";
      }
      dispatch(showAlert({ alertText, alertState: "error", alertType: "alert" }));
    } finally {
      setLoading(false);
    }
  }

  const handleSuccessLogin = (data) => {
    dispatch(setLoginData(data));
    restoreUserProducts(dispatch, data);
    logInAlert(dispatch, t);
    setTimeout(() => navigate("/"), 1000); // Faster redirect
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        dispatch(showAlert({ alertText: "Google did not return a valid token.", alertState: "error", alertType: "alert" }));
        return;
      }

      const response = await authApi.googleLogin(idToken);
      if (response.data) {
        handleSuccessLogin(response.data);
      }
    } catch (error) {
      const msg = error?.response?.data || "Google Login Failed. Please try again later.";
      dispatch(showAlert({ alertText: msg, alertState: "error", alertType: "alert" }));
    }
  };

  // OTP Login
  const sendLoginOtp = async () => {
    if (!emailOrPhone) {
      dispatch(showAlert({ alertText: "Please enter your email, username or phone number first", alertState: "error", alertType: "alert" }));
      return;
    }
    try {
      await authApi.sendOtp(emailOrPhone);
      setView(VIEW.OTP);
      dispatch(showAlert({ alertText: "OTP sent! Please check your registered email inbox.", alertState: "success", alertType: "alert" }));
    } catch (error) {
      const msg = error?.response?.data || "Failed to send OTP.";
      dispatch(showAlert({ alertText: msg, alertState: "error", alertType: "alert" }));
    }
  };

  const verifyLoginOtp = async () => {
    if (!otpCode) {
      dispatch(showAlert({ alertText: "Please enter the OTP code", alertState: "error", alertType: "alert" }));
      return;
    }
    try {
      const response = await authApi.verifyOtp(emailOrPhone, otpCode);
      if (response.data) {
        handleSuccessLogin(response.data);
      }
    } catch {
      dispatch(showAlert({ alertText: "Invalid or expired OTP", alertState: "error", alertType: "alert" }));
    }
  };

  // Forgot Password flow
  const sendForgotOtp = async () => {
    if (!forgotEmail) {
      dispatch(showAlert({ alertText: "Please enter your account email, username or phone", alertState: "error", alertType: "alert" }));
      return;
    }
    try {
      await authApi.sendOtp(forgotEmail);
      setView(VIEW.RESET);
      dispatch(showAlert({ alertText: "OTP sent! Check your registered email for the reset code.", alertState: "success", alertType: "alert" }));
    } catch (error) {
      const msg = error?.response?.data || "Failed to send OTP.";
      dispatch(showAlert({ alertText: msg, alertState: "error", alertType: "alert" }));
    }
  };

  const resetPassword = async () => {
    if (!resetOtp || !newPassword || !confirmPassword) {
      dispatch(showAlert({ alertText: "Please fill all fields", alertState: "error", alertType: "alert" }));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(showAlert({ alertText: "Passwords do not match", alertState: "error", alertType: "alert" }));
      return;
    }
    if (newPassword.length < 8) {
      dispatch(showAlert({ alertText: "Password must be at least 8 characters", alertState: "error", alertType: "alert" }));
      return;
    }
    try {
      await authApi.resetPassword(forgotEmail, resetOtp, newPassword);
      dispatch(showAlert({ alertText: "Password reset successfully! Please log in.", alertState: "success", alertType: "alert" }));
      setView(VIEW.LOGIN);
      setForgotEmail(""); setResetOtp(""); setNewPassword(""); setConfirmPassword("");
    } catch (error) {
      const msg = error?.response?.data || "Invalid OTP or request expired.";
      dispatch(showAlert({ alertText: msg, alertState: "error", alertType: "alert" }));
    }
  };

  return (
    <div className={s.formContainer}>
      <form action="POST" className={s.form} onSubmit={handleSubmit}>
        <h2>{t("nav.login")}</h2>
        <p>{t("loginSignUpPage.enterDetails")}</p>

        {/* ── Normal Login ── */}
        {view === VIEW.LOGIN && (
          <>
            <LogInFormInputs />
            <div className={s.buttons}>
              <button type="submit" className={s.loginBtn} disabled={loading}>
                {loading ? "Logging in..." : t("buttons.login")}
              </button>
              <button
                type="button"
                className={s.forgotBtn}
                onClick={() => setView(VIEW.FORGOT)}
              >
                {t("loginSignUpPage.forgotPassword")}
              </button>
            </div>
            <span className={s.otpToggle} onClick={sendLoginOtp}>
              Login with OTP instead?
            </span>
          </>
        )}

        {/* ── OTP Login ── */}
        {view === VIEW.OTP && (
          <div className={s.otpVerification}>
            <p className={s.otpHint}>Enter the 6-digit code sent to <strong>{emailOrPhone}</strong></p>
            <div className={s.otpInput}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <button type="button" className={s.loginBtn} onClick={verifyLoginOtp}>
              Verify &amp; Login
            </button>
            <span className={s.otpToggle} onClick={() => setView(VIEW.LOGIN)}>
              ← Back to Password Login
            </span>
          </div>
        )}

        {/* ── Forgot Password ── */}
        {view === VIEW.FORGOT && (
          <div className={s.otpVerification}>
            <p className={s.otpHint}>Enter your account email to receive a reset OTP.</p>
            <div className={s.otpInput}>
              <input
                type="email"
                placeholder="Your account email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <button type="button" className={s.loginBtn} onClick={sendForgotOtp}>
              Send Reset OTP
            </button>
            <span className={s.otpToggle} onClick={() => setView(VIEW.LOGIN)}>
              ← Back to Login
            </span>
          </div>
        )}

        {/* ── Reset Password ── */}
        {view === VIEW.RESET && (
          <div className={s.otpVerification}>
            <p className={s.otpHint}>Enter the OTP sent to <strong>{forgotEmail}</strong> and your new password.</p>
            <div className={s.otpInput}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit OTP"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div className={s.otpInput}>
              <input
                type="password"
                placeholder="New Password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className={s.otpInput}>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="button" className={s.loginBtn} onClick={resetPassword}>
              Reset Password
            </button>
            <span className={s.otpToggle} onClick={() => setView(VIEW.FORGOT)}>
              ← Resend OTP
            </span>
          </div>
        )}

        {/* Google Login — always visible */}
        <div className={s.googleBtnContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              dispatch(
                showAlert({
                  alertText: "Google Login Failed. Please check your Google account or try again.",
                  alertState: "error",
                  alertType: "alert",
                })
              )
            }
          />
        </div>

        <div className={s.signUpMessage}>
          <span>{t("loginSignUpPage.dontHaveAcc")}</span>
          <Link to="/signup">{t("nav.signUp")}</Link>
        </div>
      </form>
    </div>
  );
};
export default LogInForm;

function logInAlert(dispatch, t) {
  const alertText = t("toastAlert.loginSuccess");
  const alertState = "success";
  setTimeout(
    () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
    1500
  );
}

function internetConnectionAlert(dispatch, t) {
  const alertText = t("toastAlert.loginFailed");
  const alertState = "error";
  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}

/**
 * After login, restore the user's saved favorites and wishlist
 * from their per-user localStorage slot.
 */
function restoreUserProducts(dispatch, responseData) {
  const userId = responseData?.user?.id || responseData?.id;
  if (!userId) return;
  const favoritesProducts = loadUserData("favoritesProducts", userId);
  const wishList = loadUserData("wishList", userId);
  dispatch(loadUserProducts({ favoritesProducts, wishList }));
}
