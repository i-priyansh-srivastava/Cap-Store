import '../../styles/ProductDetail.css';
import React, { useState } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import AuthService from '../../services/authService';
import HeartButton from '../Wishlist/HeartButton';
import RelatedProducts from './RelatedProducts';

const relatedProducts = [
  {
    name: "T Jacket Combo",
    price: "₹200 – ₹210",
    image: "https://via.placeholder.com/200x250?text=Jacket+Combo",
  },
  {
    name: "Funky Hoodie",
    price: "₹120 – ₹125",
    image: "https://via.placeholder.com/200x250?text=Funky+Hoodie",
  },
  {
    name: "Cream T-Shirt",
    price: "₹60 – ₹65",
    image: "https://via.placeholder.com/200x250?text=Cream+Tee",
  },
  {
    name: "Solid Shirt",
    price: "₹80 – ₹85",
    image: "https://via.placeholder.com/200x250?text=Solid+Shirt",
  },
];


const ProductDetail = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="product-detail">
        <p>No product selected.</p>
        <button className='backBTN' onClick={onBack}>Back</button>
      </div>
    );
  }

  // Check if product is out of stock
  const isOutOfStock = () => {
    return product.stockCount <= 0;
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    // Don't allow quantity more than available stock
    const maxQuantity = isOutOfStock() ? 0 : product.stockCount;
    setQuantity(Math.min(value, maxQuantity));
  };

  const incrementQuantity = () => {
    if (!isOutOfStock()) {
      setQuantity((prev) => Math.min(prev + 1, product.stockCount));
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = async (product) => {
    // Don't allow adding to cart if out of stock
    if (isOutOfStock()) {
      alert('This product is out of stock!');
      return;
    }

    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        alert('Please login to add to cart!');
        return;
      }
      await axios.post(`http://localhost:5000/api/v1/cart/${user.user.id}`, {
        productId: product._id,
        quantity: quantity,
      });
      alert('Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        alert('Please login to add to wishlist!');
        return;
      }
      await axios.post(`http://localhost:5000/api/v1/wishlist/${user.user.id}`, {
        productId: product._id
      });
      alert('Product added to wishlist!');
    } catch (err) {
      console.error('Add to wishlist error:', err);
      alert('Failed to add to wishlist');
    }
  };

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={onBack} style={{ marginBottom: '1rem' }}>Back</button>
      <div className="product-top">
        <div className="left">
          <div className="image-container" style={{ position: 'relative' }}>
            <img
              className="main-img"
              src={product.imageUrl || 'https://via.placeholder.com/300x400?text=Product+Main'}
              alt={product.productName}
            />
            {isOutOfStock() && (
              <div className="out-of-stock-banner">
                Out of Stock
              </div>
            )}
          </div>
          {/* <div className="thumbnails">
            {(product.relatedPhotos && product.relatedPhotos.length > 0
              ? product.relatedPhotos
              : ['https://via.placeholder.com/70x100/blue?text=blue', 'https://via.placeholder.com/70x100/purple?text=purple'])
              .map((url, idx) => (
                <img key={idx} src={url} alt={`thumb-${idx}`} />
              ))}
          </div> */}
        </div>

        <div className="right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <p className="breadcrumb">{product.category || 'Category'} / {product.productName}</p>
            <HeartButton
              productId={product._id}
              initialWishlisted={product.isWishlisted}
              onToggle={() => { }}
            />
          </div>
          <h2>{product.productName}</h2>
          <p className="price">₹{product.price} <span className="free-ship">+ Free Shipping</span></p>
          <p className="short-desc">{product.description}</p>

          {isOutOfStock() && (
            <div className="stock-status out-of-stock">
              <span>❌ Out of Stock</span>
            </div>
          )}

          <div className="size-selector">
            <span>Size:</span>
            {(product.availableSize || ['S', 'M', 'L', 'XL']).map((size) => (
              <button key={size}>{size}</button>
            ))}
          </div>

          <div className="quantity-add">
            <div className="quantity-controls">
              <button
                type="button"
                className="arrow-btn"
                onClick={decrementQuantity}
                disabled={isOutOfStock()}
              >−</button>
              <input
                type="number"
                min="1"
                max={isOutOfStock() ? 0 : product.stockCount}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isOutOfStock()}
              />
              <button
                type="button"
                className="arrow-btn"
                onClick={incrementQuantity}
                disabled={isOutOfStock()}
              >+</button>
            </div>

            <button
              className="add-cart"
              onClick={() => handleAddToCart(product)}
              disabled={isOutOfStock()}
            >
              {isOutOfStock() ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <ul className="features">
            <li>🚚 Free shipping on orders over ₹50</li>
            <li>🔄 No-Risk Money Back Guarantee!</li>
            <li>↩️ No Hassle Refunds</li>
            <li>🔐 Secure Payments</li>
          </ul>
        </div>
      </div>

      <div className="related-section">
        <RelatedProducts productId={product._id} category={product.category} gender={product.gender} />
      </div>
    </div>
  );
};

export default ProductDetail;
