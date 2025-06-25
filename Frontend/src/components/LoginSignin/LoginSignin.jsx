import React, { useState, useEffect } from 'react';
import '../../styles/LoginSignin.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const LoginSign = (props) => {
    const roleMap = {
        Patient: "/patient_dashboard",
        Doctor: "/doctor_dashboard",
        Admin: "/admin_dashboard"
    };

    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [roleDropdown, setroleDropdown] = useState('Patient');

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const navigate = useNavigate();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);

    const toggleForm = () => {
        props.setLogin((prevState) => !prevState);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/login', { email, password });
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
            const response = await axios.post('http://localhost:5000/api/v1/signup', { email, username, password, role: roleDropdown });
            console.log(response);

            if (response) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', email);
                setRole(response.data.role);
                setEmail('');
                setPassword('');
                setUsername('');
                setroleDropdown('Patient');
                navigate(roleMap[response.data.role], { state: { email: response.data.email } });
            }
        } catch (error) {
            toast.error('Signup failed. Please try again.');
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
                                    <legend>Please, enter your username, email, and password for sign up.</legend>

                                    <div className="input-block">
                                        <label htmlFor="signup-username">Name</label>
                                        <input id="signup-username" value={username} onChange={handleUsernameChange} type="text" required />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="signup-email">E-mail</label>
                                        <input id="signup-email" value={email} onChange={handleEmailChange} type="email" required />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="signup-password">Password</label>
                                        <input id="signup-password" value={password} onChange={handlePasswordChange} type="password" required />
                                    </div>

                                    <div className='roleDropdown' >
                                        <label for="selectRole">Sign in as:</label>
                                        <select
                                            name="role"
                                            id="role"
                                            value={roleDropdown}
                                            onChange={(e) => setroleDropdown(e.target.value)}
                                            required
                                        >
                                            <option value="Patient">Patient</option>
                                            <option value="Doctor">Doctor</option>
                                        </select>
                                    </div>

                                </fieldset>
                                <button type="submit" className="btn-signup">Sign Up</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginSign;
