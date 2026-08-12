import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ForgotPassword } from "./pages/ForgotPassword"
import { CategoriesPage } from "./pages/CategoriesPage"
import { useEffect, useState } from "react"
import { Navbar } from "./components/Navbar"
import axios from "axios"
import { getAccessToken, isAuthenticated } from "./services/auth"
import { getGuestCart } from "./services/guest_cart"
import { ProductPage } from "./pages/ProductPage"
import { Toaster } from "react-hot-toast"
import { CheckoutPage } from "./pages/CheckoutPage"
import { PaymentPage } from "./pages/PaymentPage"
import { OrdersPage } from "./pages/OrdersPage"
import { ProtectedRoute } from "./routes/ProtectedRoutes"
import { RouteTracker } from "./routes/RouteTracker"

function App() {

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async (authenticated) => {

    if (!authenticated) {
      const guestCart = getGuestCart();
        try {

          const response = await axios.post(
            "http://127.0.0.1:8000/api/guest_cart/",
            {
                items: guestCart
            }
          );
          setCartItems(response.data);
          setLoading(false);
          return;
        } catch (error) {
          console.log(error)
        }
    }

    try {
      console.log("fetching auth cart items")
      const accessToken = getAccessToken()

      const response = await axios.get(
          "http://127.0.0.1:8000/api/cart/",
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`
              }
          }
      );
      setCartItems(response.data.results[0]);
      setLoading(false);
    } catch (error) {
        console.error(error);
    }
  };

    
const initialize = async () => {
    const auth = await isAuthenticated();

    setAuthenticated(auth);

    // if (auth) {
      await fetchCartItems(auth);
    // } else {
    //     setCartItems([]);
    // }
};


  // Use effect to set authentication status and then get users cartItems
  useEffect(() => {      

      // eslint-disable-next-line react-hooks/set-state-in-effect
      initialize();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>

    <Toaster position="top-right" />
    
    <BrowserRouter>

    {/* Route Tracker to find location after login */}
    <RouteTracker />

    <Navbar
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
      fetchCartItems={fetchCartItems}
      cartItems={cartItems}
      authenticated={authenticated}
      initialize={initialize}
    />
      <Routes>
        
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login initialize={initialize}/>} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Forgot Page */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Category page */}
        <Route
          path="/products/:category"
          element={
            <CategoriesPage
              setIsCartOpen={setIsCartOpen}
              fetchCartItems={fetchCartItems}
              authenticated={authenticated}
            />
          }
        />

        {/* Product Page */}
        <Route
          path="/product/:productSlug"
          element={
            <ProductPage
              setIsCartOpen={setIsCartOpen}
              fetchCartItems={fetchCartItems}
              authenticated={authenticated}
            />
          }
        />

        {/* Checkout Page */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage cartItems={cartItems} loading={loading} />
            </ProtectedRoute>
          }
        />

        {/* Payment Page */}
        <Route
          path="/secure-payment"
          element={
            <ProtectedRoute>
              <PaymentPage
                cartItems={cartItems}
                fetchCartItems={fetchCartItems}
              />
            </ProtectedRoute>
          }>
        </Route>

        {/* Orders Page */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Not Found Page */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App