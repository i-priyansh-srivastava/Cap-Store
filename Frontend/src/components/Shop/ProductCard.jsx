import '../../styles/ProductCard.css';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDetail from './ProductDetail';
import AuthService from '../../services/authService';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getProduct = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/getProducts');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        alert('Please login to add to cart!');
        return;
      }
      await axios.post(`http://localhost:5000/api/v1/cart/${user.user.id}`, {
        productId: product._id,
        quantity: 1
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

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  if (showDetails && selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={handleBack} />;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product._id}>
          <div className="clickable-area" onClick={() => handleCardClick(product)}>
            <div className="image-container">
              <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.productName} />
            </div>

            <div className="product-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="product-name">{product.productName}</h3>
                <FaHeart
                  className="wishlist-heart"
                  style={{ color: 'crimson', cursor: 'pointer' }}
                  title="Add to Wishlist"
                  onClick={e => { e.stopPropagation(); handleAddToWishlist(product); }}
                />
              </div>
              <p className="category">{product.gender}</p>
              <p className="price">${product.price}</p>

              <div className="rating">
                {[...Array(5)].map((_, i) =>
                  i < product.rating ? (
                    <FaStar key={i} className="star filled" />
                  ) : (
                    <FaRegStar key={i} className="star" />
                  )
                )}
              </div>

              <div className="size-options">
                {product.availableSize.map((size) => (
                  <span key={size} className="size">
                    {size}
                  </span>
                ))}
              </div>

              {/* <div className="color-options">
                {product.relatedPhotos.slice(0, 3).map((colorUrl, index) => (
                  <span
                    key={index}
                    className="color"
                    style={{ backgroundImage: `url(${colorUrl})`, backgroundSize: 'cover' }}
                  ></span>
                ))}
              </div> */}
            </div>
          </div>

          <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
