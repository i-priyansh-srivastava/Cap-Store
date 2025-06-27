import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from '../../services/authService';
import Nav from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import '../../styles/Checkout.css';
import { toast } from 'react-toastify';

const MyCart = (props) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
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

  const getTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2);
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        toast.info('Please login to update cart!');
        return;
      }

      const res = await axios.put(`http://localhost:5000/api/v1/cart/${user.user.id}`, {
        productId,
        quantity: newQuantity
      });

      setCart(res.data.cart);
      toast.success('Cart updated successfully!');
    } catch (err) {
      console.error('Update quantity error:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to update quantity');
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        toast.info('Please login to remove items!');
        return;
      }

      const res = await axios.post(`http://localhost:5000/api/v1/cart/remove/${user.user.id}`, {
        productId
      });

      setCart(res.data.cart);
      toast.success('Item removed from cart!');
    } catch (err) {
      console.error('Remove item error:', err);
      toast.error('Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    window.location.href = '/cart';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="cart-container">
        <div className="cart-section">
          <h2>My Cart ({getItemCount()})</h2>
          {!cart || !cart.items.length ? (
            <div className="empty-cart">
              <p>No items present in your cart.</p>
              <button className="continue-shopping-btn" onClick={() => window.location.href = '/shop'}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.items.map((item) => (
                <div className="cart-item" key={item.product._id}>
                  <img className='cart-item-img' src={item.product.imageUrl || 'https://via.placeholder.com/80'} alt={item.product.productName} />
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
            </>
          )}
        </div>
        {cart && cart.items.length > 0 && (
          <div className="summary-section">
            <h3>Cart Summary</h3>
            <div className="summary-row">
              <span>Items ({getItemCount()})</span>
              <span>₹{getTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free (For Premium Members)</span>
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
            <div className="continue-shopping" onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </div>
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default MyCart;