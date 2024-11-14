import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import login from '../images/login.png';
import '../styles/hero.css';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Invalid Email Format');
            return;
        }

        if (!password.trim()) {
            toast.error('Password is required');
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, { email, password });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.user.id);
                localStorage.setItem('username', res.data.user.name);
                toast.success(res.data.message);
                navigate(location.state || '/');
                window.location.reload();
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    toast.error('User not registered');
                } else if (err.response.status === 401) {
                    toast.error('Incorrect password');
                } else {
                    toast.error(err.response.data.message || 'Login failed');
                }
            } else {
                console.error('Error:', err);
                toast.error('An error occurred. Please try again later.');
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='marginStyle'>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                    <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <div className="featured-image mb-3 animateImg">
                            <img src={login} className="img-fluid" width={500} alt="Login" />
                        </div>
                    </div>
                    <form className="col-md-6 right-box" onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Welcome</h2>
                                <p>We are happy to have you back!</p>
                            </div>
                            <div className="input-group d-flex align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        type="email"
                                        placeholder="Your email ID"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        type="password"
                                        placeholder="Your password"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mt-4">
                                <div className="form-outline flex-fill mb-0">
                                    <button
                                        className="btn btn-lg text-white"
                                        type="submit"
                                        style={{ backgroundColor: 'blueviolet', width: '100%' }}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center my-3">
                                <div className="form-outline flex-fill mb-0">
                                    <Link to='/register' className="btn btn-outline-dark btn-lg btn-block" style={{ width: '100%' }}>
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
