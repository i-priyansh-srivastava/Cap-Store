import '../../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2 className="footer-logo">Cap-Store</h2>
                    <p>Subscribe</p>
                    <div className="subscribe">
                        <input type="email" placeholder="Your Email" />
                        <button className="subscribe-btn">→</button>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Social</h3>
                    <ul>
                        <li className='hoverLink'>LinkedIn</li>
                        <li className='hoverLink'>Instagram</li>
                        <li className='hoverLink'>Facebook</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Update Link</h3>
                    <ul>
                        <li className='hoverLink'>About Us</li>
                        <li className='hoverLink'>Service</li>
                        <li className='hoverLink'>Our App</li>
                        <li className='hoverLink'>News Blog</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Location & Contact</h3>
                    <p>211B Thornridge Cir, Syracuse, Connecticut 35624</p>
                    <p>(704) 555-0127</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p><a>Terms of Use </a>  <strong className='divider'>||</strong> <a>Privacy Policy</a> </p>
            </div>
        </footer>
    );
};

export default Footer;
