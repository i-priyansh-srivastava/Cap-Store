import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from '../../services/authService';
import Nav from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import '../../styles/MyAccount.css';

const OrderHistory = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = AuthService.getCurrentUser();
        if (!user || !user.user || !user.user.id) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/v1/orders/${user.user.id}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getSubtotal = (order) => {
    if (!order.products) return 0;
    return order.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="my-account-container">
        <h2>Order History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <div className="order-list">
            {orders.map(order => {
              const subtotal = getSubtotal(order);
              const deliveryCharge = order.deliveryCharge || 0;
              const isFreeDelivery = deliveryCharge === 0;
              
              return (
                <div className="order-card" key={order._id}>
                  <div className="order-header">
                    <span>Order ID: {order._id}</span>
                    <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
                    <span>Total: ₹{order.totalAmount}</span>
                    {order.paymentId && <span>Payment ID: {order.paymentId}</span>}
                  </div>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery:</span>
                      <span className={isFreeDelivery ? "free-delivery" : "delivery-charge"}>
                        {isFreeDelivery ? "Free" : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    {isFreeDelivery && (
                      <div className="premium-badge">
                        ⭐ Premium Member - Free Delivery
                      </div>
                    )}
                  </div>
                  <div className="order-products">
                    {order.products && order.products.map(item => (
                      <div className="order-product" key={item.product?._id || Math.random()}>
                        <img src={item.product?.imageUrl || 'https://via.placeholder.com/60'} alt={item.product?.productName || 'Product not found'} />
                        <div>
                          <div><strong>{item.product?.productName || 'Product not found'}</strong></div>
                          <div>Qty: {item.quantity}</div>
                          <div>Price: ₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default OrderHistory; 