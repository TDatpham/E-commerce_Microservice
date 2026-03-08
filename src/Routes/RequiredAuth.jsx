import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { pagesRequireSignIn } from "../Data/globalVariables";
import { showAlert } from "../Features/alertsSlice";

const ADMIN_PAGES = ["/admin"];

const RequiredAuth = ({ children }) => {
  const { loginInfo } = useSelector((state) => state.user);
  const { isSignIn, role } = loginInfo;
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pathName = location.pathname;
  const isLoginOrSignUpPage = pathName === "/login" || pathName === "/signup";

  const isPageRequiringSignIn = (page) =>
    pagesRequireSignIn.includes(page) && !isSignIn;

  const isAdminPage = ADMIN_PAGES.includes(pathName);
  const isAdmin = role === "ADMIN" || role === "admin";

  if (isLoginOrSignUpPage && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn(pathName)) {
    loginFirstAlert();
    return <Navigate to="/login" />;
  }
  if (isAdminPage && (!isSignIn || !isAdmin)) {
    setTimeout(
      () =>
        dispatch(
          showAlert({
            alertText: "Access denied. Admin only.",
            alertState: "error",
            alertType: "alert",
          })
        ),
      300
    );
    return <Navigate to="/" />;
  }

  function loginFirstAlert() {
    const alertText = t("toastAlert.pageRequiringSignIn");
    const alertState = "warning";
    setTimeout(
      () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
      300
    );
  }

  return children;
};

export default RequiredAuth;
