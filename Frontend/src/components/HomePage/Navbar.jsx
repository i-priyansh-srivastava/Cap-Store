import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import AuthService from '../../services/authService';

const Nav = (props) => {
    const [profileBox, setProfileBox] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check authentication status when component mounts
        const checkAuth = () => {
            const authenticated = AuthService.isAuthenticated();
            setIsAuthenticated(authenticated);
            if (authenticated) {
                setCurrentUser(AuthService.getCurrentUser());
            }
        };
        
        checkAuth();
        // Check auth status every time profileBox is toggled
    }, [profileBox]);

    const ViewProfile = () => {
        setProfileBox(!profileBox);
    }

    const LoginHandler = () => {
        props.setLogin(true);
    }

    const LogoutHandler = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setProfileBox(false);
        toast.success('Logged out successfully!');
        // Redirect to home page
        window.location.href = '/';
    }

    return (
        <div className="Navi">
            <div className='together'>
                <img className='logo'></img>
                <div className='Symbol'>Cap-Store</div>
            </div>
            <div className='gen'>
                <button className='genBtn'><Link to={"/"} >Home</Link></button>
                <button className='genBtn'><Link to={"/shop"} >Shop</Link></button>
                <button className='genBtn'><Link to={"/cart"} >Cart</Link></button>
                <button className='genBtn'><Link to={"/premium"} >Go Premium</Link></button>
            </div>
            <div className='ToProfile' onClick={ViewProfile}>
                <img width="48" height="48" src="https://img.icons8.com/ink/48/user-male-circle.png" alt="user-male-circle" />

                {profileBox && (
                    <div className="dropdown">
                        {!isAuthenticated ? (
                            <button onClick={LoginHandler}><Link to="/login"><strong>LogIn / SignUp</strong></Link></button>
                        ) : (
                            <>
                                <div className="user-info">
                                    <strong>Welcome, {currentUser?.user?.name || 'User'}!</strong>
                                </div>
                                <button>My Account</button>
                                <button>Order History</button>
                                <button>Wishlist</button>
                                <button>Notification</button>
                                <button onClick={LogoutHandler}>Logout</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Nav;