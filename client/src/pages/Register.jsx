import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import register from '../images/register.png';
import toast from 'react-hot-toast';
import '../styles/hero.css';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const validatePhone = (phone) => {
        return phone.length === 10 && /^\d{10}$/.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }
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
        if (!phone.trim()) {
            toast.error('Phone Number is required');
            return;
        }
        if (!validatePhone(phone)) {
            toast.error('Phone number must be exactly 10 digits');
            return;
        }
        if (!address.trim()) {
            toast.error('Address is required');
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, {
                name, email, password, phone, address
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error('User already registered with this email');
            } else {
                console.error('Error:', err);
                toast.error('Server Error');
            }
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length <= 10) { // Limit to 10 digits
            setPhone(value);
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
                            <img src={register} className="img-fluid" width={500} alt="Register" />
                        </div>
                    </div>
                    <form className="col-md-6 right-box" onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Welcome</h2>
                                <p>Your Dream Car is Waiting!</p>
                            </div>
                            <div className="input-group d-flex align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder='Your name'
                                        required
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        type="email"
                                        placeholder='Your email ID'
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
                                        placeholder='Your password'
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={phone}
                                        onChange={handlePhoneChange} // Restrict input to 10 digits
                                        type="text"
                                        required
                                        placeholder='Your phone number'
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        type="text"
                                        required
                                        placeholder='Your address'
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
                                        Register
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center my-3">
                                <div className="form-outline flex-fill mb-0">
                                    <Link to='/login' className="btn btn-outline-dark btn-lg btn-block" style={{ width: '100%' }}>
                                        Login
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

export default Register;
