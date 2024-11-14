import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/sellcar.css';

const SellCar = () => {
    const location = useLocation();
    const car = location.state?.car; 
    const [carImages, setCarImages] = useState(car?.images || []); 
    const [title, setTitle] = useState(car?.title || '');
    const [description, setDescription] = useState(car?.description || '');
    const [tags, setTags] = useState(car?.tags || '');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const isEditMode = !!car; 

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError('User not logged in');
        }
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/')); 
        if (files.length + carImages.length > 10) {
            setError('You can only upload up to 10 images.');
        } else {
            setError('');
            setCarImages((prevImages) => [...prevImages, ...files]);
        }
    };

    const handleRemoveImage = (index) => {
        setCarImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (carImages.length === 0 && !isEditMode) {
            setError('Please upload at least 1 image.');
            return;
        }

        if (!userId) {
            setError('User ID is missing.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('userId', userId);
        
        if (isEditMode) {
            formData.append('carId', car._id);
        }

        carImages.forEach((image) => {
            formData.append('carImages', image);
        });

        try {
            const response = isEditMode 
                ? await axios.put(`${process.env.REACT_APP_API_URL}/api/cars/${car._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                : await axios.post(`${process.env.REACT_APP_API_URL}/api/cars`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            setMessage(response.data.message || (isEditMode ? 'Car details updated successfully' : 'Car details uploaded successfully'));
            setTitle('');
            setDescription('');
            setTags('');
            setCarImages([]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload car details');
            console.error('Error uploading car details:', err);
        }
    };

    return (
        <div>
            <section id="sellcar" className="sellcar_wrapper">
                <div className="container">
                    <div className="text-center">
                        <h2 className="sellcar_title">{isEditMode ? 'Update Your Car' : 'Sell Your Car'}</h2>
                        <p className="sellcar_subtitle">Add or update your car details with images</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Car Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                placeholder="Car Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImageChange}
                                accept="image/*"
                                multiple
                            />
                            <div className="image-preview">
                                {carImages.length > 0 && carImages.map((image, index) => {
                                    const imageSrc = image instanceof File
                                        ? URL.createObjectURL(image) 
                                        : `${process.env.REACT_APP_API_URL}${image}`; 

                                    return (
                                        <div key={index} className="image-container">
                                            <img
                                                src={imageSrc}
                                                alt={`Car Image ${index + 1}`}
                                                className="img-thumbnail"
                                                style={{ maxWidth: '100px', margin: '10px' }}
                                            />
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                &#10006;
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {error && <div className="text-danger">{error}</div>}
                        {message && <div className="text-success">{message}</div>}

                        <button type="submit" className="btn btn-primary">
                            {isEditMode ? 'Update' : 'Submit'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default SellCar;
