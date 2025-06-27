import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/RelatedProducts.css';
import ProductCard from './ProductCard';

const RelatedProducts = ({ productId, category, gender }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/v1/relatedProducts/${productId}?category=${encodeURIComponent(category)}&gender=${encodeURIComponent(gender)}`);
        setRelated(res.data);
      } catch (err) {
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };
    if (productId && category && gender) fetchRelated();
  }, [productId, category, gender]);

  if (loading) return <div className="related-loading">Loading related products...</div>;
  if (!related.length) return <div className="related-empty">No related products found.</div>;

  return (
    <div className="related-section">
      <h2>Related Products</h2>
      <div className="related-list">
        {related.map(product => (
          <div className="related-card" key={product._id}>
            <img src={product.imageUrl || 'https://via.placeholder.com/200x250?text=Product'} alt={product.productName} />
            <h4>{product.productName}</h4>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 