import React, { useState, useEffect } from 'react';
import '../styles/brands.css';
import { ColorRing } from 'react-loader-spinner';

const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

const Brandshome = () => {
    const [loading, setLoading] = useState(true);
    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
            setImageList(Object.keys(images));
        }, 2000); // Adjust time as needed

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <section id="brands" className="brand_wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center mb-5">
                            <p className="brand_subtitle">Explore an array of exciting new Brands!</p>
                            <h2 className="brand_title">Latest Brands showcase</h2>
                        </div>
                    </div>
                    {loading ?
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            <ColorRing
                                visible={true}
                                colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                            />
                        </div>
                        :
                        <div className="row justify-content-center">
                            {imageList.map((image, index) => (
                                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4 showcase_card">
                                    <img
                                        src={images[image]}
                                        alt={`Brand ${index}`}
                                        decoding="async"
                                        className="mb-4 img-fluid"
                                        style={{ maxWidth: '100%', maxHeight: '190px', objectFit: 'contain' }}
                                    />
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </section>
        </div>
    );
}

export default Brandshome;
