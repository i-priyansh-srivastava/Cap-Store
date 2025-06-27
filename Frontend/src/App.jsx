import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/LoginSignin/ProtectedRoute';
import HomePage from './components/HomePage/HomePage';
import Login from './components/LoginSignin/LoginSignin';
import ProductPage from './components/Shop/ProductPage';
import Checkout from './components/Cart/Checkout';
import GoPremium from './components/Premium/GoPremium';
import AddProductForm from './components/ADMIN/AddProducts';
import MyAccount from "./components/MyAccount/MyAccount"
import MyWishlist from "./components/Wishlist/MyWishlist";
import OrderHistory from './components/MyAccount/OrderHistory';
import EarlyProductForm from './components/ADMIN/EarlyAccess';
import EarlyAccessPage from './components/EarlyAccess/EarlyAccessPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLogin, setLogin] = useState(true);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: '14vh' }}
      />
      <Router>
        <Routes>
          <Route path='/' element={<HomePage isLogin={isLogin} setLogin={setLogin} />}></Route>
          <Route path='/shop' element={<ProductPage isLogin={isLogin} setLogin={setLogin} />}></Route>
          <Route path="/login" element={<Login isLogin={isLogin} setLogin={setLogin} />} />
          <Route path="/account" element={
              <ProtectedRoute>
                <MyAccount isLogin={isLogin} setLogin={setLogin} />
              </ProtectedRoute>
            }
          />

          <Route path="/wishlist" element={
              <ProtectedRoute>
                <MyWishlist isLogin={isLogin} setLogin={setLogin} />
              </ProtectedRoute>
            }
          />
          
          <Route path="/cart" element={
              <ProtectedRoute>
                <Checkout isLogin={isLogin} setLogin={setLogin} />
               </ProtectedRoute>
            }
          />
          <Route path="/premium" element={
              <ProtectedRoute>
                <GoPremium isLogin={isLogin} setLogin={setLogin} />
              </ProtectedRoute>
            }
          />

          <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistory isLogin={isLogin} setLogin={setLogin} />
              </ProtectedRoute>
            }
          />

          <Route path='/addProductForm' element={<AddProductForm/>}></Route>
          <Route path='/earlyProductForm' element={<EarlyProductForm/>}></Route>
          <Route path='/earlyAccess' element={
              <ProtectedRoute>
                <EarlyAccessPage isLogin={isLogin} setLogin={setLogin} />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App
