import React, { useState, useEffect } from 'react';
import '../../styles/LoginSignin.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

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
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
            console.log(response.data.role);
            if (response) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', email);
                setRole(response.data.role);
                navigate(roleMap[response.data.role], { state: { email: response.data.email } });
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/signin', {
                name,
                email,
                userName,
                password,
                phone,
                address
            });

            if (response) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', email);
                setRole(response.data.role);
                
                setEmail('');
                setPassword('');
                setName('');
                setUserName('');
                setPhone('');
                setAddress('');
                navigate(roleMap[response.data.role], { state: { email: response.data.email } });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
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
                                        <label htmlFor="signup-password">Password</label>
                                        <input
                                            id="signup-password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
