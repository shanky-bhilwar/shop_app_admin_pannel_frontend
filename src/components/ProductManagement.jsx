import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import '../stylesheets/ProductManagement.css';

export default function ProductManagement() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchShops() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallshops`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch shops');
        const data = await res.json();
        setShops(data || []);
        setFilteredShops(data || []);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Unable to load shops');
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase().trim();
    if (!keyword) {
      setFilteredShops(shops);
      return;
    }

    const filtered = shops.filter((shop) => {
      return (
        shop.shopName?.toLowerCase().includes(keyword) ||
        shop.category?.toString().toLowerCase().includes(keyword) ||
        shop.email?.toLowerCase().includes(keyword) ||
        shop.mobile?.toString().includes(keyword)
      );
    });

    setFilteredShops(filtered);
  };

  return (
    <AdminLayout>
      <div className="pm-container">
        <h2 className="pm-heading">All Shops</h2>

        {/* Search Bar */}
        <div className="pm-search">
          <input
            type="text"
            placeholder="Search by name, email, mobile"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pm-search-input"
          />
          <button className="pm-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {loading ? (
          <p className="pm-loading-text">Loading shops…</p>
        ) : error ? (
          <p className="pm-error-text">{error}</p>
        ) : (
          <div className="pm-grid">
            {filteredShops.map((shop) => (
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
                      {[shop.state, shop.place, shop.locality, shop.pinCode || shop.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
