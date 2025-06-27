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

    const checkAuth = () => {
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
            const user = AuthService.getCurrentUser();
            setCurrentUser(user);
            console.log('Navbar - User premium status:', user?.user?.isPremium);
            console.log('Navbar - Full user data:', user);
        } else {
            setCurrentUser(null);
            console.log('Navbar - No authenticated user');
        }
    };

    useEffect(() => {
        // Check authentication status when component mounts
        checkAuth();
        
        // Listen for storage changes (when user logs in/out in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Check auth status every time profileBox is toggled
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [profileBox]);

    // Force refresh when props change (login/logout)
    useEffect(() => {
        checkAuth();
    }, [props.setLogin]);

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

    const isPremium = currentUser?.user?.isPremium;

    return (
        <div className="Navi">
            <div className='together'>
                <img className='logo'></img>
                <div className='Symbol'>Cap-Store</div>
            </div>
            <div className='gen'>
                <button className='genBtn'><Link to={"/"} >Home</Link></button>
                <button className='genBtn'><Link to={"/shop"} >Shop</Link></button>
                {isPremium && (
                    <button className='genBtn premium-btn'>
                        <Link to={"/earlyAccess"} >🚀 Early Access</Link>
                    </button>
                )}
                <button className='genBtn'><Link to={"/cart"} >Cart</Link></button>
                {!isPremium && (
                    <button className='genBtn'><Link to={"/premium"} >Go Premium</Link></button>
                )}
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
                                    {isPremium && (
                                        <div className="premium-badge">
                                            ⭐ Premium Member
                                        </div>
                                    )}
                                </div>
                                <button> <Link to="/account"><strong>My Account</strong></Link></button>
                                <button><Link to="/orders"><strong>Order History</strong></Link></button>
                                <button><Link to="/wishlist"><strong>Wishlist</strong></Link></button>
                                <button onClick={LogoutHandler}><strong>Logout</strong></button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Nav;