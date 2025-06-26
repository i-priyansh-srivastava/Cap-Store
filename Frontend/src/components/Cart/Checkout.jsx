import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "../HomePage/Footer.jsx";
import Nav from "../HomePage/Navbar.jsx";

import AuthService from '../../services/authService';
import '../../styles/Checkout.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const Checkout = (props) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = AuthService.getCurrentUser();
        if (!user || !user.user || !user.user.id) {
          setCart(null);
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/v1/cart/${user.user.id}`);
        setCart(res.data);
      } catch (err) {
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const getTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2);
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = async () => {
    await loadRazorpayScript();
    const amount = parseFloat(getTotal()) * 100; // Razorpay expects paise
    const user = AuthService.getCurrentUser();
    if (!user || !user.user || !user.user.id) {
      alert('Please login to checkout!');
      return;
    }
    const options = {
      key: process.env.RAZORPAY_KEY_ID, 
      amount: amount,
      currency: 'INR',
      name: 'Cap-Store',
      description: 'Order Payment',
      handler: async function (response) {
        try {
          for (const item of cart.items) {
            await axios.post('http://localhost:5000/api/v1/product/reduce-stock', { productId: item.product._id });
          }
          alert('Payment successful! Stock updated. Payment ID: ' + response.razorpay_payment_id);
          window.location.reload();
        } catch (err) {
          alert('Payment succeeded but failed to update stock.');
        }
      },
      prefill: {
        name: user.user.name,
        email: user.user.email,
      },
      theme: {
        color: '#2854f0',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <div>Loading...</div>;
  if (!cart || !cart.items.length) return <div>Your cart is empty.</div>;

  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="checkout-container">
        <div className="cart-section">
          <h2>Cart Items ({getItemCount()})</h2>
          {cart.items.map((item) => (
            <div className="cart-item" key={item.product._id}>
              <img src={item.product.imageUrl || 'https://via.placeholder.com/80'} alt={item.product.productName} />
              <div className="cart-item-info">
                <h4>{item.product.productName}</h4>
                <div>${item.product.price} each</div>
                <div>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
              <div className="cart-item-qty">x{item.quantity}</div>
            </div>
          ))}
        </div>
        <div className="summary-section">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({getItemCount()})</span>
            <span>${getTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free (For Premium Members)</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getTotal()}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          <div className="continue-shopping">Continue Shopping</div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
};

export default Checkout; 