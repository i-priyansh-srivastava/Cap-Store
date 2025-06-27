import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Premium.css';
import Nav from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import AuthService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const PremiumCheckout = (props) => {
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!agreedToTerms) {
      toast.info('Please agree to the Terms and Conditions to continue.');
      return;
    }

    const user = AuthService.getCurrentUser();
    if (!user || !user.user || !user.user.id) {
      toast.info('Please login to subscribe to premium!');
      return;
    }

    setLoading(true);
    try {
      await loadRazorpayScript();
      
      const amount = 29 * 100; // Razorpay expects paise

      const options = {
        key: "rzp_test_IKddTR8cigmr5D",
        amount: amount,
        currency: 'INR',
        name: 'CapStore Premium',
        description: 'Premium Subscription - 1 Year',
        handler: async function (response) {
          try {
            console.log('Premium payment successful:', response);
            
            const subscribeResponse = await axios.post('http://localhost:5000/api/v1/premium/subscribe', {
              userId: user.user.id,
              paymentId: response.razorpay_payment_id
            });

            if (subscribeResponse.status === 200) {
              const updatedUser = {
                ...user,
                user: {
                  ...user.user,
                  isPremium: true
                }
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              
              toast.success('Congratulations! You are now a Premium member! 🎉');
              
              props.setLogin((prevState) => !prevState);
              
              navigate('/orders');
            } else {
              toast.error('Payment successful but failed to activate premium. Please contact support.');
            }
          } catch (err) {
            console.error('Premium activation error:', err);
            toast.error('Payment successful but failed to activate premium. Please contact support.');
          }
        },
        prefill: {
          name: user.user.name,
          email: user.user.email,
        },
        theme: {
          color: '#e91e63',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Subscription error:', err);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="checkout-container">
        <h2 className="title">Start Your Premium Journey</h2>
        <div className="checkout-content">

          <div className="premium-summary">
            <h4>SUBSCRIBE TO</h4>
            <h2>CapStore Premium</h2>
            <ul className="benefits-list">
              <li>🚀 Early Access to New Products</li>
              <li>💸 Exclusive Discounted Deals</li>
              <li>⭐ Premium-Only Products</li>
              <li>🚚 Free Home Delivery</li>
              <li>🎁 Priority Customer Support</li>
              <li>📱 Premium Mobile App Features</li>
            </ul>

            <div className="price-breakdown">
              <p>Subscription <span>₹9/year</span></p>
              <p>Activation Fee <span>₹20 (once)</span></p>
            </div>

            <input 
              type="text" 
              placeholder="Apply Discount Code" 
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <p className="total">Total <span>₹29</span></p>

            <label className="terms">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Auto Renewal</a>.
            </label>

            <button 
              className="subscribe-btn" 
              onClick={handleSubscribe}
              disabled={loading || !agreedToTerms}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default PremiumCheckout;
