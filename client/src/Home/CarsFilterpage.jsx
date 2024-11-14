import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardsPage = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [titleFilter, setTitleFilter] = useState('');
    const [tagsFilter, setTagsFilter] = useState('');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars`);
                setCars(response.data.cars);
                setFilteredCars(response.data.cars); 
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        fetchCars();
    }, []);

    useEffect(() => {
        const filtered = cars.filter((car) => {
            const matchesTitle = car.title.toLowerCase().includes(titleFilter.toLowerCase());
            const matchesTags = car.tags.toLowerCase().includes(tagsFilter.toLowerCase());
            return matchesTitle && matchesTags;
        });
        setFilteredCars(filtered);
    }, [titleFilter, tagsFilter, cars]);

    return (
        <div className="car-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filter by title"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by tags"
                    value={tagsFilter}
                    onChange={(e) => setTagsFilter(e.target.value)}
                />
            </div>
            <div className="car-list">
                {filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
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
                        </div>
                    ))
                ) : (
                    <p>No cars found</p>
                )}
            </div>
        </div>
    );
};

export default CardsPage;
