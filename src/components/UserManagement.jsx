import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import '../stylesheets/UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getalluser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/search-users/${searchKeyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setUsers(data.users || []);
      setFilter('all');
      setError('');
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/deleteuser/${selectedUser._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      closeModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      closeModal();
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'subscribed') return Boolean(user.subscriptionId);
    if (filter === 'non') return !user.subscriptionId;
    return true;
  });

  return (
    <AdminLayout>
      <div className="um-container">
        <h2 className="um-heading">User Management</h2>

        {/* Search Bar */}
        <div className="um-search">
          <input
            type="text"
            placeholder="Search by name, email, or mobile"
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="um-search-input"
          />
          <button className="um-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="um-filter">
          <button
            className={`um-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`um-filter-btn ${filter === 'subscribed' ? 'active' : ''}`}
            onClick={() => setFilter('subscribed')}
          >
            Subscribed
          </button>
          <button
            className={`um-filter-btn ${filter === 'non' ? 'active' : ''}`}
            onClick={() => setFilter('non')}
          >
            Non‐Subscribed
          </button>
        </div>

        {loading ? (
          <div className="um-loading">Loading users...</div>
        ) : error ? (
          <div className="um-error">{error}</div>
        ) : (
          <div className="um-table">
            <div className="um-row um-header">
              <div className="um-cell">Name</div>
              <div className="um-cell">Mobile</div>
              <div className="um-cell">Location</div>
              <div className="um-cell">Subscription</div>
              <div className="um-cell">Action</div>
            </div>
            {filteredUsers.map((user, idx) => (
              <div
                key={user._id}
                className={`um-row ${idx % 2 === 0 ? 'um-row--even' : 'um-row--odd'}`}
              >
                <div className="um-cell" data-label="Name">{user.name}</div>
                <div className="um-cell" data-label="Mobile">{user.mobileNumber}</div>
                <div className="um-cell" data-label="Location">
                  {[user.state, user.place, user.locality, user.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div className="um-cell" data-label="Subscription">
                  {user.subscriptionId ? 'Active' : 'None'}
                </div>
                <div className="um-cell" data-label="Action">
                  <button className="um-btn-delete" onClick={() => openModal(user)}>
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
                Are you sure you want to delete user “{selectedUser.name}”?
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
