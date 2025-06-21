import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import '../stylesheets/UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // "all" | "subscribed" | "non"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(
          'https://shop-app-backend-gsx6.onrender.com/adminDashboard/getalluser'
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
      const res = await fetch(
        `https://shop-app-backend-gsx6.onrender.com/adminDashboard/deleteuser/${selectedUser._id}`,
        { method: 'DELETE' }
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

  // Filter users based on subscriptionId presence
  const filteredUsers = users.filter((user) => {
    if (filter === 'subscribed') return Boolean(user.subscriptionId);
    if (filter === 'non') return !user.subscriptionId;
    return true; // "all"
  });

  return (
    <AdminLayout>
      <div className="um-container">
        <h2 className="um-heading">User Management</h2>

        {/* Toggle Filter (top-right) */}
        <div className="um-filter">
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
          {/* Optional “All” button if needed: */}
          {/* <button
            className={`um-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button> */}
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
                <div className="um-cell">{user.name}</div>
                <div className="um-cell">{user.mobileNumber}</div>
                <div className="um-cell">
                  {[user.state, user.place, user.locality, user.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div className="um-cell">
                  {user.subscriptionId ? 'Active' : 'None'}
                </div>
                <div className="um-cell">
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
