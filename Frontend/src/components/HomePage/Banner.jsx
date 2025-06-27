import "../../styles/Banner.css";
import React from 'react';

const Banner = () => {
    return (
        <div className="banner">
            <div className="banner-content">
                <div className="banner-overlay-text">Timeless Fashion for the Modern Wardrobe</div>
                <img className="banner-img" src="https://images.pexels.com/photos/7576325/pexels-photo-7576325.jpeg" alt="Banner Image" />
            </div>
            <div className="offer-banner">
                <h3>Get 15% off on your first order</h3>
            </div>
        </div>
    );
}

export default Banner;