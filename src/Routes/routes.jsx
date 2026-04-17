import About from "../Components/About/About";
import AccountPage from "../Components/AccountPage/AccountPage";
import Cart from "../Components/Cart/Cart";
import CheckoutPage from "../Components/CheckoutPage/CheckoutPage";
import Contact from "../Components/Contact/Contact";
import FavoritePage from "../Components/FavoritePage/FavoritePage";
import Home from "../Components/Home/Home";
import LogIn from "../Components/LogIn/LogIn";
import NotFoundPage from "../Components/NotFoundPage/NotFoundPage";
import OrderPage from "../Components/OrderPage/OrderPage";
import ProductDetailsPage from "../Components/ProductDetailsPage/ProductDetailsPage";
import ProductsCategoryPage from "../Components/ProductsCategory/ProductsCategoryPage";
import ProductsPage from "../Components/ProductsPage/ProductsPage";
import SearchPage from "../Components/Search/SearchPage";
import SignUp from "../Components/SignUp/SignUp";
import WishList from "../Components/WishList/WishList";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import SellerDashboard from "../Components/Seller/SellerDashboard";
import MomoPaymentPage from "../Components/MomoPaymentPage/MomoPaymentPage";

export const ROUTES_CONFIG = [
  { path: "/", element: <Home /> },
  { path: "/contact", element: <Contact /> },
  { path: "/about", element: <About /> },
  { path: "/details", element: <ProductDetailsPage /> },
  { path: "/category", element: <ProductsCategoryPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/favorites", element: <FavoritePage /> },
  { path: "/wishlist", element: <WishList /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/order", element: <OrderPage /> },
  { path: "/momo-payment/:orderId", element: <MomoPaymentPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/profile", element: <AccountPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/seller", element: <SellerDashboard /> },
  { path: "*", element: <NotFoundPage /> },
];
