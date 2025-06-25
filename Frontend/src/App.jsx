import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/LoginSignin/ProtectedRoute';
import HomePage from './components/HomePage/HomePage';
import Login from './components/LoginSignin/LoginSignin';
import ProductPage from './components/Shop/ProductPage';
import MyCart from './components/Cart/MyCart';
import GoPremium from './components/Premium/GoPremium';


function App() {
  const [isLogin, setLogin] = useState(true);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/shop' element={<ProductPage />}></Route>
          <Route path="/login" element={<Login isLogin={isLogin} setLogin={setLogin} />} />
          <Route path="/cart" element={
              // <ProtectedRoute>
                <MyCart/>
              // </ProtectedRoute>
            }
          />
          <Route path="/premium" element={
              // <ProtectedRoute>
                <GoPremium/>
              // </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App
