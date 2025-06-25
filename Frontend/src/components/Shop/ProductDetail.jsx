import '../../styles/ProductDetail.css';

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

const ProductDetail = () => {
  return (
    <div className="product-detail">
      <div className="product-top">
        <div className="left">
          <img
            className="main-img"
            src="https://via.placeholder.com/300x400?text=Product+Main"
            alt="Main Product"
          />
          <div className="thumbnails">
            {['blue', 'purple', 'black', 'green'].map((color, idx) => (
              <img
                key={idx}
                src={`https://via.placeholder.com/70x100/${color}?text=${color}`}
                alt={color}
              />
            ))}
          </div>
        </div>

        <div className="right">
          <p className="breadcrumb">Home / Men / Essential Polos</p>
          <h2>Essential Polos</h2>
          <p className="price">$80.00 – $90.00 <span className="free-ship">+ Free Shipping</span></p>
          <p className="short-desc">
            Elevate your everyday style with our Essential Polos, the perfect blend of comfort and sophistication.
          </p>

          <div className="size-selector">
            <span>Size:</span>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <button key={size}>{size}</button>
            ))}
          </div>

          <div className="quantity-add">
            <input type="number" min="1" defaultValue="1" />
            <button className="add-cart">Add to Cart</button>
          </div>

          <ul className="features">
            <li>🚚 Free shipping on orders over ₹50</li>
            <li>🔄 No-Risk Money Back Guarantee!</li>
            <li>↩️ No Hassle Refunds</li>
            <li>🔐 Secure Payments</li>
          </ul>
        </div>
      </div>

      <div className="product-tabs">
        <h3>Description</h3>
        <p>
          Crafted from premium, breathable fabric, these polos offer a tailored fit that’s ideal for both casual
          outings and smart-casual settings. Designed with classic collars and subtle detailing, they bring timeless
          appeal to your wardrobe.
        </p>
      </div>

      <div className="related-section">
        <h2>Related Products</h2>
        <div className="related-list">
          {relatedProducts.map((item, idx) => (
            <div key={idx} className="related-card">
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
