import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { pagesRequireSignIn } from "../Data/globalVariables";
import { showAlert } from "../Features/alertsSlice";

import { isUserAdmin, isUserSeller } from "../Functions/helper";

const RequiredAuth = ({ children }) => {
  const { loginInfo } = useSelector((state) => state.user);
  const isSignIn = loginInfo?.isSignIn;
  const userRole = loginInfo?.role;
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pathName = location.pathname;
  const isLoginOrSignUpPage = pathName === "/login" || pathName === "/signup";

  const isPageRequiringSignIn = (page) =>
    pagesRequireSignIn.includes(page) && !isSignIn;

  const isAdminPage = pathName === "/admin" || pathName.startsWith("/admin/");
  const isAdmin = isUserAdmin(userRole);

  const isSellerPage = pathName === "/seller" || pathName.startsWith("/seller/");
  const isSeller = isUserSeller(userRole);

  if (isLoginOrSignUpPage && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn(pathName)) {
    loginFirstAlert();
    return <Navigate to="/login" />;
  }

  if (isAdminPage && (!isSignIn || !isAdmin)) {
    const roleDesc = userRole ? ` (Your role: ${JSON.stringify(userRole)})` : " (Not logged in)";
    accessDeniedAlert("Access denied. Admin only." + roleDesc);
    return <Navigate to="/" />;
  }

  if (isSellerPage && (!isSignIn || !isSeller)) {
    const roleDesc = userRole ? ` (Your role: ${JSON.stringify(userRole)})` : " (Not logged in)";
    accessDeniedAlert("Access denied. Seller only." + roleDesc);
    return <Navigate to="/" />;
  }

  function accessDeniedAlert(text) {
    setTimeout(
      () =>
        dispatch(
          showAlert({
            alertText: text,
            alertState: "error",
            alertType: "alert",
          })
        ),
      300
    );
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
