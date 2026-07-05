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

function App() {

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [authenicated, setAuthenticated] = useState(false);

  const fetchCartItems = async (authenicated) => {

    if (!authenicated) {
      const guestCart = getGuestCart();
        try {

          const response = await axios.post(
            "http://127.0.0.1:8000/api/guest_cart/",
            {
                items: guestCart
            }
          );
          console.log(response);
          setCartItems(response.data);
          console.log(cartItems);
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
      console.log(response.data.results)
      setCartItems(response.data.results[0]);
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

      initialize();

  }, []);

  return (
    <>
    
    <BrowserRouter>
    <Navbar
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
      fetchCartItems={fetchCartItems}
      cartItems={cartItems}
      authenicated={authenicated}
      initialize={initialize}
    />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login initialize={initialize}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/products/:category"
          element={
            <CategoriesPage
              setIsCartOpen={setIsCartOpen}
              fetchCartItems={fetchCartItems}
              authenicated={authenicated}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App