import Nav from "./Navbar.jsx";
import Banner from "./Banner.jsx";
import Footer from "./Footer.jsx";
import Categories from "./Categories.jsx";
import Testimonials from "./Testimonials.jsx";
import "../../styles/HomePage.css";

import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Homepage = (props) => {
    

    return (
        <div className="Homepage">
            <Nav setLogin={props.setLogin}></Nav>
            <Banner></Banner>
            <Categories></Categories>
            <Testimonials></Testimonials>
            <Footer></Footer>
        </div>
    )
}

export default Homepage

