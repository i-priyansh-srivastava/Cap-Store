import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from '../../services/authService';
import Nav from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import '../../styles/Wishlist.css';
import HeartButton from './HeartButton';
import { toast } from 'react-toastify';

const MyWishlist = (props) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = AuthService.getCurrentUser();
        if (!user || !user.user || !user.user.id) {
          setWishlist([]);
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/v1/wishlist/${user.user.id}`);
        setWishlist(res.data.products || []);
      } catch (err) {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) return;
      await axios.post(`http://localhost:5000/api/v1/wishlist/remove/${user.user.id}`, { productId });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Item removed from wishlist!');
    } catch (err) {
      console.log(err);
      toast.error('Failed to remove item from wishlist');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="wishlist-container">
        <h2>My Wishlist</h2>
        {!wishlist.length ? (
          <div className="empty-wishlist">
            <p>No items present in your wishlist.</p>
            <button className="continue-shopping-btn" onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product._id}>
                <img src={product.imageUrl || 'https://via.placeholder.com/200'} alt={product.productName} />
                <div className="wishlist-info">
                  <h3>{product.productName}</h3>
                  <p>{product.description}</p>
                  <div className="wishlist-price">${product.price}</div>
                  <button className="remove-wishlist-btn" onClick={() => handleRemove(product._id)}>Remove</button>
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

export default MyWishlist; 