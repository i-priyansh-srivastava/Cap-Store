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
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
            {orders.map(order => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <span>Order ID: {order._id}</span>
                  <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
                  <span>Total: ₹{order.totalAmount}</span>
                  {order.paymentId && <span>Payment ID: {order.paymentId}</span>}
                </div>
                <div className="order-products">
                  {order.products.map(item => (
                    <div className="order-product" key={item.product._id}>
                      <img src={item.product.imageUrl || 'https://via.placeholder.com/60'} alt={item.product.productName} />
                      <div>
                        <div><strong>{item.product.productName}</strong></div>
                        <div>Qty: {item.quantity}</div>
                        <div>Price: ₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default OrderHistory; 