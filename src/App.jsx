import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Menu from "./pages/Menu.jsx";
import Shop from "./pages/Shop.jsx";
import Blog from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Checkout from "./pages/Checkout.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import Faqs from "./pages/Faqs.jsx";
import LegalPage from "./pages/LegalPage.jsx";

// Admin Imports
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminSections from "./pages/admin/AdminSections.jsx";
import AdminHomepage from "./pages/admin/AdminHomepage.jsx";
import AdminOffers from "./pages/admin/AdminOffers.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("coffeehub-auth") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("coffeehub-auth", String(isLoggedIn));
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Routes>
      {/* Admin Routes (independent of customer login) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="sections" element={<AdminSections />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="customers" element={<AdminCustomers />} />
        {/* Fallback for unknown admin routes */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/*" element={
        !isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onSignup={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <div className="flex min-h-screen flex-col">
            <Navbar onLogout={handleLogout} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/privacy" element={<LegalPage title="Privacy policy" />} />
                <Route path="/terms" element={<LegalPage title="Terms & conditions" />} />
                <Route path="*" element={<div className="container py-16">Not Found</div>} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        )
      } />
    </Routes>
  );
}
