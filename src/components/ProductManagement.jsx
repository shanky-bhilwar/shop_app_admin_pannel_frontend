// src/components/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/ProductManagement.css';
import AdminLayout from './AdminLayout';
export default function ProductManagement() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchShops() {
      try {
        const res = await fetch(
          'https://shop-app-backend-gsx6.onrender.com/adminDashboard/getallshops'
        );
        if (!res.ok) throw new Error('Failed to fetch shops');
        const data = await res.json();
        // Response is a plain array of shop objects
        setShops(data || []); 
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Unable to load shops');
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="pm-loading-container">
        <p className="pm-loading-text">Loading shops…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pm-error-container">
        <p className="pm-error-text">{error}</p>
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="pm-container">
      <h2 className="pm-heading">All Shops</h2>
      <div className="pm-grid">
        {shops.map((shop) => (
          <Link
            key={shop._id}
            to={`/admin/shops/products/${shop._id}`}
            className="pm-card-link"
          >
            <div className="pm-card">
              <img
                src={shop.headerImage}
                alt={shop.shopName}
                className="pm-card__image"
              />
              <div className="pm-card__body">
                <h3 className="pm-card__title">{shop.shopName}</h3>
                <p className="pm-card__text">
                  <strong>Category:</strong>{' '}
                  {Array.isArray(shop.category)
                    ? shop.category.join(', ')
                    : shop.category}
                </p>
                <p className="pm-card__text">
                  <strong>Location:</strong>{' '}
                  {[
                    shop.state,
                    shop.place,
                    shop.locality,
                    shop.pinCode || shop.pincode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
