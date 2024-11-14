import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mycar.css';

const MyCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            setError('User not logged in');
            setLoading(false);
            return;
        }
        axios.get(`${process.env.REACT_APP_API_URL}/api/cars/${userId}`)
            .then((response) => {
                setCars(response.data.cars);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching cars:", error);
                setError('Failed to fetch cars');
                setLoading(false);
            });
    }, []);

    const handleDelete = async (carId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/cars/${carId}`);
            setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
        } catch (error) {
            console.error('Error deleting car:', error);
            setError('Failed to delete car');
        }
    };

    const handleEdit = (car) => {
        navigate(`/carsell/${car._id}`, { state: { car } });
    };

    if (loading) {
        return <p className="loading">Loading...</p>;
    }

    return (
        <div className="car-container">
            <div className="car-list">
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <div key={car._id} className="car-card">
                            <h3>{car.title}</h3>
                            <div className="car-images">
                                {car.images && car.images.length > 0 ? (
                                    car.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${process.env.REACT_APP_API_URL}${image}`}
                                            alt={`Car image ${index + 1} for ${car.title}`}
                                            className="car-image"
                                        />
                                    ))
                                ) : (
                                    <p>No images available</p>
                                )}
                            </div>
                            <p>{car.tags}</p>
                            <p>{car.description}</p>
                            <button onClick={() => handleEdit(car)} className="edit-button">Edit</button>
                            <button onClick={() => handleDelete(car._id)} className="delete-button">Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No cars found</p>
                )}
            </div>
        </div>
    );
};

export default MyCar;
