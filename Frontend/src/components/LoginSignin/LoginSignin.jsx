import React, { useState, useEffect } from 'react';
import '../../styles/LoginSignin.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../../services/authService';

const LoginSign = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const navigate = useNavigate();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handleUserNameChange = (e) => setUserName(e.target.value);
    const handlePhoneChange = (e) => setPhone(e.target.value);
    const handleAddressChange = (e) => setAddress(e.target.value);

    const toggleForm = () => {
        props.setLogin((prevState) => !prevState);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.login(email, password);
            if (response) {
                toast.success('Login successful!');
                setEmail('');
                setPassword('');
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                name,
                email,
                password,
                userName,
                phone,
                address
            };

            const response = await AuthService.signup(userData);

            console.log(response);
            

            if (response) {
                toast.success('Signup successful!');
                setEmail('');
                setPassword('');
                setName('');
                setUserName('');
                setPhone('');
                setAddress('');
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className='loginMain'>
            <div className='loginBody'>
                <h1 className='loginTitle'>Welcome!! to Cap-Store</h1>
                <section className="forms-section">
                    <div className="forms">
                        <div className={`form-wrapper ${props.isLogin ? "is-active" : ""}`}>
                            <button type="button" className="switcher switcher-login" onClick={toggleForm}>
                                Login
                                <span className="underline"></span>
                            </button>
                            <form className="form form-login" onSubmit={handleLogin}>
                                <fieldset>
                                    <legend>Please, enter your email and password for login.</legend>
                                    <div className="input-block">
                                        <label htmlFor="login-email">E-mail</label>
                                        <input
                                            id="login-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="login-password">Password</label>
                                        <input
                                            id="login-password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>
                                </fieldset>
                                <button type="submit" className="btn-login">Login</button>
                            </form>
                        </div>


                        <div className={`form-wrapper ${!props.isLogin ? "is-active" : ""}`}>
                            <button type="button" className="switcher switcher-signup" onClick={toggleForm}>
                                Sign Up
                                <span className="underline"></span>
                            </button>
                            <form className="form form-signup" onSubmit={handleSignUp}>
                                <fieldset>
                                    <legend>Please, enter your details for sign up.</legend>
                                    <div className="input-block">
                                        <label htmlFor="signup-name">Full Name</label>
                                        <input
                                            id="signup-name"
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-block">
                                        <label htmlFor="signup-username">Username</label>
                                        <input
                                            id="signup-username"
                                            type="text"
                                            required
                                            value={userName}
                                            onChange={handleUserNameChange}
                                        />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="signup-email">E-mail</label>
                                        <input id="signup-email" value={email} onChange={handleEmailChange} type="email" required />
                                    </div>

                                    <div className="input-block">
                                        <label htmlFor="signup-password">Password</label>
                                        <input
                                            id="signup-password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-block">
                                        <label htmlFor="signup-phone">Phone</label>
                                        <input
                                            id="signup-phone"
                                            type="text"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                        />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="signup-address">Address</label>
                                        <input
                                            id="signup-address"
                                            type="text"
                                            value={address}
                                            onChange={handleAddressChange}
                                        />
                                    </div>

                                    <button type="submit" className="btn-signup">Sign Up</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginSign;
