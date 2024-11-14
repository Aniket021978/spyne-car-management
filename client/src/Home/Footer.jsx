import React from 'react'
import '../styles/footer.css'
import { BsLinkedin, BsGithub } from 'react-icons/bs'
import logo from '../images/logo.png'

const Footer = () => {
    return (
        <div>
            <section id="contact" className="footer_wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 footer_logo mb-4 mb-lg-0">
                        <img src={logo} width="150" style={{ filter: 'invert(100%) sepia(100%) saturate(1000%) hue-rotate(209deg)' }} />
                            <h3 style={{ color: 'blueviolet' }}>carLoom</h3>
                            <p className="footer_text" style={{ textAlign: 'justify' }}>At carLoom, we're dedicated to making your car buying experience as smooth as the road ahead. With a wide range of brands, expert guidance, secure transactions, and innovative features, we're your trusted partner on your journey to finding the perfect ride. Drive your dreams with CarWale, where your satisfaction is our ultimate destination.</p>
                        </div>
                        <div className="col-lg-4 px-lg-5 mb-4 mb-lg-0">
                            <h3 className="footer_title" style={{ color: 'blueviolet' }}>Contact</h3>
                            <p className="footer_text">
                                <a >aniket021978@gmail.com</a><br />
                            </p>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                            <h3 className="footer_title" style={{ color: 'blueviolet' }}>Social Media</h3>
                            <p>
                                <a href="https://www.linkedin.com/in/aniket-bansal-9b1909227" className="footer_social_media_icon" style={{ color: 'white' }}><BsLinkedin size={25} /></a>
                                <a href="https://github.com/Aniket021978" className="footer_social_media_icon" style={{ color: 'white' }}><BsGithub size={25} /></a>
                            </p>
                        </div>
                        <div className="col-12 footer_credits text-center">
                            <span>© 2024 <a>carwale</a>™. All Rights Reserved.</span>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}

export default Footer