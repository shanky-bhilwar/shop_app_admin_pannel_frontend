// src/components/ShopManagement.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import '../stylesheets/UserManagement.css';

export default function ShopManagement() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');


  useEffect(() => {
    async function fetchShops() {
      try {
        const res = await fetch(
          'https://shop-app-backend-gsx6.onrender.com/adminDashboard/getallshops'
        );
        if (!res.ok) throw new Error('Failed to fetch shops');
        const data = await res.json();
        // response is an array of shop objects
        setShops(data || []);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Unable to load shops.');
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  // search shop function 
  const handleSearch = async () => {
  if (!searchKeyword.trim()) return;
  try {
    setLoading(true);
    const res = await fetch(`https://shop-app-backend-gsx6.onrender.com/adminDashboard/search-shop/${searchKeyword}`);
    const data = await res.json();
    setShops(data.shops || []);
    setError('');
  } catch (err) {
    console.error('Search failed:', err);
    setError('Search failed');
  } finally {
    setLoading(false);
  }
};

  // function to change ban or active status of shop
  const handleToggleBan = async (shopId) => {
  try {
    const res = await fetch(`https://shop-app-backend-gsx6.onrender.com/adminDashboard/change-shop-ban-status/${shopId}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to toggle ban status');
    
    // ✅ Safest: Refetch all shops to get latest isBanned value
    const refetch = await fetch('https://shop-app-backend-gsx6.onrender.com/adminDashboard/getallshops');
    const freshData = await refetch.json();
    setShops(freshData || []);

  } catch (err) {
    console.error('Toggle ban failed:', err);
    setError('Toggle ban failed');
  }
};

  const openModal = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedShop(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedShop) return;
    try {
      const res = await fetch(
        `https://shop-app-backend-gsx6.onrender.com/api/shops/${selectedShop._id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete shop');

      // Remove the deleted shop from state
      setShops((prev) => prev.filter((s) => s._id !== selectedShop._id));
      closeModal();
    } catch (err) {
      console.error('Error deleting shop:', err);
      setError('Failed to delete shop');
      closeModal();
    }
  };

  return (
    <AdminLayout>
      <div className="um-container">
        <h2 className="um-heading">Shop Management</h2>

        {/* search bar */}

        <div className="um-search">
  <input
    type="text"
    placeholder="Search by shop name, email, or mobile"
    value={searchKeyword}
    onChange={(e) => setSearchKeyword(e.target.value)}
    className="um-search-input"
  />
  <button className="um-search-btn" onClick={handleSearch}>Search</button>
  
</div>


        {loading ? (
          <div className="um-loading">Loading shops...</div>
        ) : error ? (
          <div className="um-error">{error}</div>
        ) : (
          <div className="um-table">
            <div className="um-row um-header">
              <div className="um-cell">Shop Name</div>
              <div className="um-cell">Category</div>
              <div className="um-cell">Location</div>
              <div className="um-cell">Status</div>
              <div className="um-cell">Action</div>
            </div>
            {shops.map((shop, idx) => (
              <div
                key={shop._id}
                className={`um-row ${idx % 2 === 0 ? 'um-row--even' : 'um-row--odd'}`}
              >
                <div className="um-cell" data-label="Shop Name">{shop.shopName}</div>
                <div className="um-cell" data-label="Category">{Array.isArray(shop.category) ? shop.category.join(', ') : shop.category}</div>
                <div className="um-cell" data-label="Location">
                  {[shop.state, shop.place, shop.locality, shop.pinCode || shop.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div className="um-cell" data-label="Status">
                <button
                  className="um-btn-delete"
                  onClick={() => handleToggleBan(shop._id)}
                  style={{
                    background: shop.isBanned === true
                      ? 'linear-gradient(135deg, #f39c12, #e67e22)' // Banned → Orange
                      : 'linear-gradient(135deg, #2ecc71, #27ae60)' // Active → Green
                  }}
                >
                  {shop.isBanned === true ? 'Ban' : 'Active'}
                </button>
                </div>

                <div className="um-cell" data-label="Action">
                  <button className="um-btn-delete" onClick={() => openModal(shop)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="um-modal-overlay">
            <div className="um-modal">
              <h3 className="um-modal-title">Confirm Delete</h3>
              <p className="um-modal-text">
                Are you sure you want to delete shop "{selectedShop.shopName}"?
              </p>
              <div className="um-modal-actions">
                 <button className="um-btn-confirm" onClick={handleDelete}>
                  OK
                </button>
                <button className="um-btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}