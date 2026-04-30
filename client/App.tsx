import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { useVisitorTracking } from "./hooks/use-visitor-tracking";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const RedirectProduct = () => {
  return <Navigate to="/products" replace />;
};

const AppRoutes = () => {
  useVisitorTracking();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Index />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <Products />
          </Layout>
        }
      />
      <Route
        path="/collections"
        element={
          <Layout>
            <Collections />
          </Layout>
        }
      />
      <Route
        path="/collections/:slug"
        element={
          <Layout>
            <Collections />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <Checkout />
          </Layout>
        }
      />
      <Route path="/product" element={<RedirectProduct />} />
      <Route
        path="/product/:slug"
        element={
          <Layout>
            <ProductDetail />
          </Layout>
        }
      />
      <Route path="/admin" element={<Admin />} />
      <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
};

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </CartProvider>
);

// Initialize React app with proper error handling
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Root element with id="root" not found in HTML. Please ensure index.html contains <div id="root"></div>',
  );
}

createRoot(rootElement).render(<App />);
