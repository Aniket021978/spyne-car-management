import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/carsFilter.css';

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
        <div className="car-container1">
            <div className="car-filters1">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    className="car-filter-input1"
                />
                <input
                    type="text"
                    placeholder="Search by tags"
                    value={tagsFilter}
                    onChange={(e) => setTagsFilter(e.target.value)}
                    className="car-filter-input1"
                />
            </div>
            <div className="car-grid1">
                {filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                        <div key={car._id} className="car-item1">
                            <h3 className="car-title1">{car.title}</h3>
                            <div className="car-images1">
                                {car.images && car.images.length > 0 ? (
                                    car.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${process.env.REACT_APP_API_URL}${image}`}
                                            alt={`Car ${index + 1}`}
                                            className="car-image1"
                                        />
                                    ))
                                ) : (
                                    <p className="car-no-images1">No images available</p>
                                )}
                            </div>
                            <p className="car-tags1">{car.tags}</p>
                            <p className="car-description1">{car.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="car-no-found1">No cars found</p>
                )}
            </div>
        </div>
    );
};

export default CardsPage;
