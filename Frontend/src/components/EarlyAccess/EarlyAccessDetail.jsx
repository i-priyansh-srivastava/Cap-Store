import React, { useState } from 'react';
import { FaStar, FaRegStar, FaHeart, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import AuthService from '../../services/authService';
import HeartButton from '../Wishlist/HeartButton';
import '../../styles/EarlyAccess.css';
import { toast } from 'react-toastify';

const EarlyAccessDetail = ({ product, onBack }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.relatedPhotos && product.relatedPhotos.length > 0 
    ? [product.imageUrl, ...product.relatedPhotos].filter(Boolean)
    : [product.imageUrl || 'https://via.placeholder.com/400'];

  const handleAddToCart = async () => {
    if (product.stockCount <= 0) {
      toast.info('This product is out of stock!');
      return;
    }

    if (!selectedSize) {
      toast.info('Please select a size!');
      return;
    }

    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        toast.info('Please login to add to cart!');
        return;
      }
      await axios.post(`http://localhost:5000/api/v1/cart/${user.user.id}`, {
        productId: product._id,
        quantity: quantity
      });
      toast.success('Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        toast.info('Please login to add to wishlist!');
        return;
      }
      await axios.post(`http://localhost:5000/api/v1/wishlist/${user.user.id}`, {
        productId: product._id
      });
      toast.success('Product added to wishlist!');
    } catch (err) {
      console.error('Add to wishlist error:', err);
      toast.error('Failed to add to wishlist');
    }
  };

  const isOutOfStock = () => {
    return product.stockCount <= 0;
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Back to Early Access
        </button>
        <div className="early-access-badge-detail">🚀 Early Access Product</div>
      </div>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            <img src={images[currentImageIndex]} alt={product.productName} />
            {isOutOfStock() && (
              <div className="out-of-stock-banner">
                Out of Stock
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.productName} ${index + 1}`}
                  className={index === currentImageIndex ? 'active' : ''}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info-detail">
          <div className="product-header">
            <h1>{product.productName}</h1>
            <HeartButton
              productId={product._id}
              initialWishlisted={product.isWishlisted}
              onToggle={handleAddToWishlist}
            />
          </div>

          <div className="product-meta">
            <p className="category">{product.category} • {product.gender}</p>
            <div className="rating">
              {[...Array(5)].map((_, i) =>
                i < product.rating ? (
                  <FaStar key={i} className="star filled" />
                ) : (
                  <FaRegStar key={i} className="star" />
                )
              )}
              <span className="rating-text">({product.rating})</span>
            </div>
          </div>

          <div className="price-section">
            <h2 className="price">₹{product.price}</h2>
            <div className="stock-info">
              {isOutOfStock() ? (
                <span className="out-of-stock">Out of Stock</span>
              ) : (
                <span className="in-stock">In Stock: {product.stockCount} available</span>
              )}
            </div>
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="tags">
              <h3>Tags</h3>
              <div className="tag-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {product.availableSize && product.availableSize.length > 0 && (
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {product.availableSize.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    disabled={isOutOfStock()}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isOutOfStock() && (
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-actions-detail">
            <button
              className={`add-to-cart-btn-detail ${isOutOfStock() ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock() || !selectedSize}
            >
              {isOutOfStock() ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              className="add-to-wishlist-btn-detail"
              onClick={handleAddToWishlist}
            >
              <FaHeart /> Add to Wishlist
            </button>
          </div>

          <div className="premium-notice-detail">
            <div className="premium-badge">⭐ Premium Exclusive</div>
            <p>This product is exclusively available to Premium members. Enjoy early access to our latest releases!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarlyAccessDetail; 