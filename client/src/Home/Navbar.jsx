import React, { useEffect, useState } from 'react';
import { BiMenuAltRight } from 'react-icons/bi';
import '../styles/navbar.css';
import logo from '../images/logo.png';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const Navbar = () => {
    const [color, setColor] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username');
        
        if (token && user) {
            setIsLoggedIn(true);
            setUsername(user);
        }
    }, []);

    const changeColor = () => {
        if (window.scrollY >= 90) {
            setColor(true);
        } else {
            setColor(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        toast.success('Logged Out Successfully');
        navigate('/');
    };

    const handleProtectedLink = (e, link) => {
        if (!isLoggedIn) {
            e.preventDefault(); 
            navigate('/login'); 
            toast.error('Please login to access this page');
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeColor);
        return () => {
            window.removeEventListener('scroll', changeColor);
        };
    }, []);

    return (
        <header className={color ? 'header_wrapper header-scrolled' : 'header_wrapper'}>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid mx-3">
                    <Link to='/'>
                        <img src={logo} width="130" style={{ filter: 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg)' }} />
                    </Link>
                    <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <BiMenuAltRight size={35} />
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav menu-navbar-nav">
                            <Link to='/' style={{ textDecoration: 'none' }}>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page">Home</a>
                                </li>
                            </Link>
                            <Link to='/about' style={{ textDecoration: 'none' }}>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page">About</a>
                                </li>
                            </Link>
                            <Link to='/cars' style={{ textDecoration: 'none' }} onClick={(e) => handleProtectedLink(e, '/cars')}>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page">Buy Cars</a>
                                </li>
                            </Link>
                            <Link to='/carsell' style={{ textDecoration: 'none' }} onClick={(e) => handleProtectedLink(e, '/carsell')}>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page">Sell Cars</a>
                                </li>
                            </Link>
                            <Link to='/mycar' style={{ textDecoration: 'none' }} onClick={(e) => handleProtectedLink(e, '/mycar')}>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page">My Cars</a>
                                </li>
                            </Link>
                        </ul>

                        <ul className="mt-2 text-center">
                            {isLoggedIn ? (
                                <>
                                    <span className="nav-link learn-more-btn" style={{cursor:'pointer'}}>{username}</span>
                                    <span 
                                        onClick={handleLogout} 
                                        className="nav-link learn-more-btn-logout"
                                        style={{cursor:'pointer', marginLeft:'10px'}}
                                    >
                                        Logout
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        style={{ textDecoration: 'none' }} 
                                        className="nav-item text-center"
                                    >
                                        <span className="nav-link learn-more-btn btn-extra-header">Login</span>
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        style={{ textDecoration: 'none' }} 
                                        className="nav-item text-center"
                                    >
                                        <span className="nav-link learn-more-btn">Register</span>
                                    </Link>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
