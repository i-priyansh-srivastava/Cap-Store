import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import AuthService from '../../services/authService';
import '../../styles/HeartButton.css';

const HeartButton = ({ productId, initialWishlisted = false, onToggle }) => {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [animating, setAnimating] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    const user = AuthService.getCurrentUser();
    if (!user || !user.user || !user.user.id) {
      alert('Please login to use wishlist!');
      return;
    }
    setAnimating(true);
    try {
      if (!wishlisted) {
        await axios.post(`http://localhost:5000/api/v1/wishlist/${user.user.id}`, { productId });
      } else {
        await axios.post(`http://localhost:5000/api/v1/wishlist/remove/${user.user.id}`, { productId });
      }
      setWishlisted(!wishlisted);
      if (onToggle) onToggle(!wishlisted);
    } catch (err) {
      // Optionally show error
    } finally {
      setTimeout(() => setAnimating(false), 400);
    }
  };

  return (
    <span
      className={`heart-btn${wishlisted ? ' wishlisted' : ''}${animating ? ' animate' : ''}`}
      title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      onClick={handleToggle}
    >
      {wishlisted ? <FaHeart /> : <FaRegHeart />}
    </span>
  );
};

export default HeartButton; 