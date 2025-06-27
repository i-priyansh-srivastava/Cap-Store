import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "../HomePage/Footer.jsx";
import Nav from "../HomePage/Navbar.jsx";
import { Link } from 'react-router-dom';
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCart();
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

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

  const getSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getDeliveryCharge = () => {
    const isPremium = currentUser?.user?.isPremium;
    return isPremium ? 0 : 50; // Free for premium, ₹50 for regular users
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const deliveryCharge = getDeliveryCharge();
    return (subtotal + deliveryCharge).toFixed(2);
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      console.log('Updating quantity for product:', productId, 'to:', newQuantity);
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        alert('Please login to update cart!');
        return;
      }

      console.log('Sending request to:', `http://localhost:5000/api/v1/cart/${user.user.id}`);
      console.log('Request data:', { productId, quantity: newQuantity });

      const res = await axios.put(`http://localhost:5000/api/v1/cart/${user.user.id}`, {
        productId,
        quantity: newQuantity
      });

      console.log('Response received:', res.data);
      setCart(res.data.cart);
    } catch (err) {
      console.error('Update quantity error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Failed to update quantity');
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      console.log('Removing product:', productId);
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        alert('Please login to remove items!');
        return;
      }

      console.log('Sending request to:', `http://localhost:5000/api/v1/cart/remove/${user.user.id}`);
      console.log('Request data:', { productId });

      const res = await axios.post(`http://localhost:5000/api/v1/cart/remove/${user.user.id}`, {
        productId
      });

      console.log('Response received:', res.data);
      setCart(res.data.cart);
    } catch (err) {
      console.error('Remove item error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      alert('Failed to remove item from cart');
    }
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
      key: process.env.RAZORPAY_KEY, // Replace with your Razorpay key
      amount: amount,
      currency: 'INR',
      name: 'Cap-Store',
      description: 'Order Payment',
      handler: async function (response) {
        try {
          console.log('Payment successful, processing order...');
          console.log('Cart items:', cart.items);

          // Validate cart structure
          if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
            console.error('Invalid cart structure:', cart);
            alert('Invalid cart data. Please try again.');
            return;
          }

          for (const item of cart.items) {
            if (!item.product || !item.product._id || !item.quantity || !item.product.price) {
              console.error('Invalid cart item:', item);
              alert('Invalid cart item data. Please try again.');
              return;
            }
          }

          // Prepare order data from cart items
          const orderProducts = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          }));

          console.log('Order products:', orderProducts);
          console.log('Total amount:', getTotal());
          console.log('User ID:', user.user.id);

          // Create order
          const orderData = {
            userId: user.user.id,
            products: orderProducts,
            totalAmount: parseFloat(getTotal()),
            deliveryCharge: getDeliveryCharge(),
            paymentId: response.razorpay_payment_id
          };

          console.log('Sending order data:', orderData);

          const orderResponse = await axios.post('http://localhost:5000/api/v1/order', orderData);
          console.log('Order response:', orderResponse.data);

          if (orderResponse.status === 201) {
            console.log('Order created successfully, clearing cart...');

            // Clear the cart after successful order creation
            try {
              const clearCartResponse = await axios.delete(`http://localhost:5000/api/v1/cart/${user.user.id}`);
              console.log('Cart cleared:', clearCartResponse.data);
            } catch (clearError) {
              console.error('Failed to clear cart:', clearError);
            }

            alert('Payment successful! Your order has been placed. Payment ID: ' + response.razorpay_payment_id);

            window.location.href = '/';
          } else {
            console.error('Order creation failed with status:', orderResponse.status);
            alert('Payment succeeded but failed to create order. Please contact support.');
          }
        } catch (err) {
          console.error('Payment success handler error:', err);
          console.error('Error response:', err.response?.data);
          console.error('Error status:', err.response?.status);

          if (err.response?.data?.message) {
            alert('Payment succeeded but order creation failed: ' + err.response.data.message);
          } else {
            alert('Payment succeeded but failed to process order. Please contact support.');
          }
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

  const isPremium = currentUser?.user?.isPremium;
  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();

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
                <div>₹{item.product.price} each</div>
                <div>Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stockCount}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-section">
          <h3>Order Summary</h3>
          {isPremium && (
            <div className="premium-notice">
              ⭐ Premium Member - Free Delivery!
            </div>
          )}
          <div className="summary-row">
            <span>Items ({getItemCount()})</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className={isPremium ? "free-shipping" : "delivery-charge"}>
              {isPremium ? "Free" : `₹${deliveryCharge}`}
            </span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{getTotal()}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          <div className="continue-shopping">
            <Link to="/shop"><strong>Continue Shopping</strong></Link>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
};

export default Checkout; 