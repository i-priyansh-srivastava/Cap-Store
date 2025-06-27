import '../../styles/EarlyAccess.css';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EarlyAccessDetail from './EarlyAccessDetail';
import AuthService from '../../services/authService';
import HeartButton from '../Wishlist/HeartButton';
import { toast } from 'react-toastify';

const EarlyAccessCard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [tags, setTags] = useState([]);

  const getEarlyAccessProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/getEarlyAccessProducts');
      setProducts(res.data);
      setFilteredProducts(res.data);
      setCategories([...new Set(res.data.map(p => p.category))]);
      setGenders([...new Set(res.data.map(p => p.gender))]);
      setTags([...new Set(res.data.flatMap(p => p.tags))]);
    } catch (error) {
      console.error('Error fetching early access products:', error);
    }
  };

  const checkPremiumStatus = () => {
    const user = AuthService.getCurrentUser();
    const premiumStatus = user?.user?.isPremium || false;
    setIsPremium(premiumStatus);
    console.log('EarlyAccessCard - Premium status:', premiumStatus);
    return premiumStatus;
  };

  useEffect(() => {
    const premiumStatus = checkPremiumStatus();
    if (premiumStatus) {
      getEarlyAccessProducts();
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const premiumStatus = checkPremiumStatus();
        if (premiumStatus) {
          getEarlyAccessProducts();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (search) {
      filtered = filtered.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()));
    }
    if (gender) {
      filtered = filtered.filter(p => p.gender === gender);
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (tag) {
      filtered = filtered.filter(p => p.tags.includes(tag));
    }
    if (sort === 'low-high') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(filtered);
  }, [search, gender, category, tag, sort, products]);

  const handleAddToCart = async (product) => {
    console.log('Adding early access product to cart:', product);
    
    if (product.stockCount <= 0) {
      toast.info('This product is out of stock!');
      return;
    }

    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.user || !user.user.id) {
        toast.info('Please login to add to cart!');
        return;
      }
      
      console.log('User authenticated, sending request to add product:', product._id);
      const response = await axios.post(`http://localhost:5000/api/v1/cart/${user.user.id}`, {
        productId: product._id,
        quantity: 1
      });
      
      console.log('Add to cart response:', response.data);
      toast.success('Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      console.error('Error response:', err.response?.data);
      toast.error('Failed to add to cart: ' + (err.response?.data?.message || err.message));
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

  const isOutOfStock = (product) => {
    return product.stockCount <= 0;
  };

  if (showDetails && selectedProduct) {
    return <EarlyAccessDetail product={selectedProduct} onBack={handleBack} />;
  }

  if (!isPremium) {
    return (
      <div className="premium-required">
        <div className="premium-required-content">
          <h2>🚀 Early Access Products</h2>
          <div className="premium-badge-large">⭐ Premium Members Only</div>
          <p>Get exclusive access to our latest products before anyone else!</p>
          <div className="premium-benefits">
            <h3>Premium Benefits:</h3>
            <ul>
              <li>🚀 Early Access to New Products</li>
              <li>💸 Exclusive Discounted Deals</li>
              <li>⭐ Premium-Only Products</li>
              <li>🚚 Free Home Delivery</li>
              <li>🎁 Priority Customer Support</li>
            </ul>
          </div>
          <button 
            className="upgrade-premium-btn"
            onClick={() => window.location.href = '/premium'}
          >
            Upgrade to Premium - ₹29/year
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page-layout">
      <aside className="filter-sidebar">
        <h3>🚀 Early Access Filters</h3>
        <div className="filter-group">
          <label>Sort by Price</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">All</option>
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Tags</label>
          <select value={tag} onChange={e => setTag(e.target.value)}>
            <option value="">All</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="clear-filters" onClick={() => { setSort(''); setGender(''); setCategory(''); setTag(''); }}>Clear Filters</button>
      </aside>
      <main className="product-main">
        <div className="early-access-header">
          <h1>🚀 Early Access Products</h1>
          <div className="premium-notice">⭐ Premium Members - Exclusive Access</div>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search early access products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2em' }}>
              <h3>No early access products available yet.</h3>
              <p>Check back soon for exclusive new releases!</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div className="product-card early-access-card" key={product._id}>
                <div className="clickable-area" onClick={() => handleCardClick(product)}>
                  <div className="image-container">
                    <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.productName} />
                    <div className="early-access-badge">🚀 Early Access</div>
                    {isOutOfStock(product) && (
                      <div className="out-of-stock-banner">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 className="product-name">{product.productName}</h3>
                      <HeartButton
                        productId={product._id}
                        initialWishlisted={product.isWishlisted}
                        onToggle={() => {}}
                      />
                    </div>
                    <p className="category">{product.gender}</p>
                    <p className="price">₹{product.price}</p>
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
                      {product.availableSize && product.availableSize.map((size, index) => (
                        <span key={index} className="size-tag">{size}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    className={`add-to-cart-btn ${isOutOfStock(product) ? 'disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock(product)) {
                        handleAddToCart(product);
                      }
                    }}
                    disabled={isOutOfStock(product)}
                  >
                    {isOutOfStock(product) ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default EarlyAccessCard; 