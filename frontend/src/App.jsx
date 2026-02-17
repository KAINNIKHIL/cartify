import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Orders from "./pages/Orders";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import CODSuccess from "./pages/CODSuccess";
import OrderDetail from "./pages/OrderDetail";


function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />

              {/* Protected routes */}
              <Route path="/checkout" element={ 
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }/>
              <Route path="/orders" element={
                <ProtectedRoute>
                <Orders />
                </ProtectedRoute>
              }/>
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                <OrderDetail />
                </ProtectedRoute>
              } />
              <Route path="/cod-success/:orderId" element={
                <ProtectedRoute>
                <CODSuccess />
                </ProtectedRoute>
              } />


            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
