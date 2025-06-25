import '../../styles/ProductCard.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useState } from 'react';
import ProductDetail from './ProductDetail';

const ProductCard = () => {
  const [showDetails, setShowDetails] = useState(false);
  const rating = 4;
  const totalStars = 5;

  const handleCardClick = () => {
    setShowDetails(true);
  };

  if (showDetails) {
    return <ProductDetail />;
  }

  return (
    <div className="product-card">
      <div className="clickable-area" onClick={handleCardClick}>
        <div className="image-container">
          <img
            src="https://media.gettyimages.com/id/1094357932/photo/cheerful-golf-player.jpg?s=612x612&w=0&k=20&c=-suX4xshkYOnhn3WNdxmH64YqXQk0hbeqwjan3Wk_Z4="
            alt="Essential Polos"
          />
          <div className="icons">
            <button className="icon-btn">🔍</button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">Essential Polos</h3>
          <p className="category">Men</p>
          <p className="price">$80.00 – $90.00</p>

          <div className="rating">
            {[...Array(totalStars)].map((_, i) =>
              i < rating ? (
                <FaStar key={i} className="star filled" />
              ) : (
                <FaRegStar key={i} className="star" />
              )
            )}
          </div>

          <div className="size-options">
            {['M', 'L', 'XL'].map((size) => (
              <span key={size} className="size">
                {size}
              </span>
            ))}
          </div>

          <div className="color-options">
            <span className="color" style={{ backgroundColor: '#5e5473' }}></span>
            <span className="color" style={{ backgroundColor: '#ccc' }}></span>
            <span className="color" style={{ backgroundColor: '#7c8853' }}></span>
          </div>
        </div>
      </div>

      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
