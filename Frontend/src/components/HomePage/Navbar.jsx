import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';


const Nav = (props) => {
    const [profileBox, setProfileBox] = useState(false)

    const ViewProfile = () => {
        setProfileBox(!profileBox);
    }
    const LoginHandler = () => {
        props.setLogin(true)
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
                        <button onClick={LoginHandler}><Link to="/login"><strong>LogIn / SignUp</strong></Link></button>

                        {/* {props.isLogin && (
                            <>
                                <button>My Account</button>
                                <button >Order History</button>
                                <button>Wishlist</button>
                                <button>Notification</button>
                                <button onClick={props.Logout}>Logout</button>
                            </>
                        )} */}
                    </div>
                )}
            </div>
        </div>

    )
}


export default Nav;