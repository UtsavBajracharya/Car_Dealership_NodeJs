import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/vehicledetail.css';

const VehicleDetails = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const [vehicle, setVehicle] = useState(null); // Store vehicle details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch vehicle details from API
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:4000/vehicles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        const data = await response.json();
        setVehicle(data); // Set vehicle data
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (vehicle) {
      const imgs = document.querySelectorAll('.img-select a');
      const imgBtns = [...imgs];
      let imgId = 1;

      imgBtns.forEach((imgItem) => {
        imgItem.addEventListener('click', (event) => {
          event.preventDefault();
          imgId = imgItem.dataset.id;
          slideImage();
        });
      });

      const slideImage = () => {
        const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;
        document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
      };

      window.addEventListener('resize', slideImage);

      return () => {
        window.removeEventListener('resize', slideImage);
      };
    }
  }, [vehicle]);

  if (loading) return <p>Loading vehicle details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!vehicle) return <p>Vehicle not found</p>;

  return (
    <div className="card-wrapper">
      <div className="card-car-details">
        <div className="car-imgs">
          <div className="img-display">
            <div className="img-showcase">
              {vehicle.images && vehicle.images.map((image, index) => (
                <img key={index} src={image} className="img-fluid" alt={`Vehicle Image ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="img-select">
            {vehicle.images && vehicle.images.map((image, index) => (
              <div key={index} className="img-item">
                <a href={image} data-id={index + 1}>
                  <img src={image} className="img-fluid" alt={`Thumbnail ${index + 1}`} />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="car-content">
          <h2 className="car-title">{vehicle.make}</h2>
          <Link to="/" className="car-link">Back to List</Link>
          <div className="car-rating">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star-half-alt"></i>
            <span>4.7 (21)</span>
          </div>

          <div className="car-price">
            <p className="last-price">Old Price: <span>${vehicle.price}</span></p>
            <p className="new-price">New Price: <span>${(vehicle.price * 0.95).toFixed(2)}</span></p>
          </div>

          <div className="car-detail">
            <h2>About this car:</h2>
            <p>{vehicle.description}</p>
            <ul>
              <li>Color: <span>{vehicle.color}</span></li>
              <li>Available: <span>{vehicle.stock > 0 ? 'In stock' : 'Out of stock'}</span></li>
              <li>Category: <span>{vehicle.category}</span></li>
              <li>Shipping Area: <span>All over the world</span></li>
              <li>Shipping Fee: <span>Free</span></li>
            </ul>
          </div>

          <div className="social-links">
            <p>Share At:</p>
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </div>
      </div>
      <Link to="/" className="btn btn-secondary mt-3">Back to List</Link>
    </div>
  );
};

export default VehicleDetails;
