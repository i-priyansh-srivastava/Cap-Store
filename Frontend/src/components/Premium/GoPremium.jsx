import '../../styles/Premium.css';
import Nav from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';

const PremiumCheckout = (props) => {
  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="checkout-container">
        <h2 className="title">Start Your Premium Journey</h2>
        <div className="checkout-content">

          <div className="payment-form">
            <h3>Pay with card</h3>
            <div className="stripe-badge">Powered by <strong>Razorpay</strong></div>
            <input type="text" placeholder="Card Number" />
            <div className="card-details">
              <input type="text" placeholder="MM / YY" />
              <input type="text" placeholder="CVC" />
            </div>
            <input type="text" placeholder="Name on Card" />
            <input type="text" placeholder="Country or Region" defaultValue="India" />
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone" />
          </div>

          <div className="premium-summary">
            <h4>SUBSCRIBE TO</h4>
            <h2>CapStore Premium</h2>
            <ul className="benefits-list">
              <li>🚀 Early Access</li>
              <li>💸 Discounted Deals</li>
              <li>⭐ Premium-Only Products</li>
              <li>🚚 Free Home Delivery</li>
            </ul>

            <div className="price-breakdown">
              <p>Subscription <span>₹9/year</span></p>
              <p>Activation Fee <span>₹20 (once)</span></p>
            </div>

            <input type="text" placeholder="Apply Discount Code" />
            <p className="total">Total <span>₹29</span></p>

            <label className="terms">
              <input type="checkbox" />
              I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Auto Renewal</a>.
            </label>

            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
      <Footer></Footer>

    </>
  );
};

export default PremiumCheckout;
