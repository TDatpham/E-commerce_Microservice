import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useSignOut from "src/Hooks/App/useSignOut";
import { isUserAdmin, isUserSeller } from "src/Functions/helper";
import SvgIcon from "../MiniComponents/SvgIcon";
import s from "./UserMenu.module.scss";
import UserMenuItemWithCount from "./UserMenuItemWithCount";

const UserMenu = ({ isActive, toggler }) => {
  const { wishList, orderProducts } = useSelector((state) => state.products);
  const { loginInfo } = useSelector((state) => state.user);
  const userRole = loginInfo?.role;
  const wishListLength = wishList.length;
  const orderProductsLength = orderProducts.length;
  const activeClass = isActive ? s.active : "";
  const navigateTo = useNavigate();
  const { t } = useTranslation();
  const signOut = useSignOut();

  function handleSignOut() {
    signOut();
    navigateTo("/", { replace: true });
  }

  return (
    <div className={`${s.userMenu} ${activeClass}`}>
       <NavLink to="/profile" aria-label="Profile page">
        <SvgIcon name="user" />
        <span>{t("userMenuItems.profile")}</span>
      </NavLink>

      {isUserAdmin(userRole) && (
        <NavLink to="/admin" aria-label="Admin dashboard">
          <SvgIcon name="admin" />
          <span>{t("userMenuItems.admin") || "Admin Dashboard"}</span>
        </NavLink>
      )}

      {isUserSeller(userRole) && (
        <NavLink to="/seller" aria-label="Seller dashboard">
          <SvgIcon name="cart" />
          <span>{t("userMenuItems.seller") || "Seller Dashboard"}</span>
        </NavLink>
      )}

      <NavLink to="/order" aria-label="Order page">
        <UserMenuItemWithCount
          props={{
            iconName: "cart",
            title: t("userMenuItems.cart"),
            countLength: orderProductsLength,
          }}
        />
      </NavLink>

      <NavLink to="/wishlist" aria-label="Wishlist page">
        <UserMenuItemWithCount
          props={{
            iconName: "save",
            title: t("userMenuItems.wishlist"),
            countLength: wishListLength,
          }}
        />
      </NavLink>

      <a href="#" onClick={handleSignOut} onBlur={toggler} aria-label="Logout">
        <SvgIcon name="boxArrowLeft" />
        <span>{t("userMenuItems.logout")}</span>
      </a>
    </div>
  );
};
export default UserMenu;
