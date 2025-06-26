import '../../styles/ProductCard.css';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDetail from './ProductDetail';
import AuthService from '../../services/authService';
import HeartButton from '../Wishlist/HeartButton';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [tags, setTags] = useState([]);

  const getProduct = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/getProducts');
      setProducts(res.data);
      setFilteredProducts(res.data);
      setCategories([...new Set(res.data.map(p => p.category))]);
      setGenders([...new Set(res.data.map(p => p.gender))]);
      setTags([...new Set(res.data.flatMap(p => p.tags))]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProduct();
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
    <div className="product-page-layout">
      <aside className="filter-sidebar">
        <h3>Filters</h3>
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
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2em' }}>No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="clickable-area" onClick={() => handleCardClick(product)}>
                  <div className="image-container">
                    <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.productName} />
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
                  </div>
                </div>
                <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductCard;
