import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import '../stylesheets/SubscriptionPlans.css';

export default function SubscriptionPlans() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCreate = async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      durationDays: Number(form.durationDays.value),
      amount: Number(form.amount.value),
      description: form.description.value.trim(),
    };

    try {
      const token = localStorage.getItem("adminToken"); // ✅ added token from localStorage

      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/createplan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ attach token here
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        form.reset();
        setShowSuccessModal(true);
      } else {
        const err = await res.json();
        alert('Error: ' + (err.message || 'Failed to create plan'));
      }
    } catch (error) {
      console.error('Create plan error:', error);
      alert('Network error: Unable to create plan');
    }
  };

  return (
    <AdminLayout>
    <div className="create-plan-container">
      <div className="header">
        <h1>Create Subscription Plan</h1>
        <Link to="/subscription-plans/edit" className="edit-button">
          Edit Plans
        </Link>
      </div>

      <form onSubmit={handleCreate} className="sp-form">
        <input name="name" placeholder="Name" required />

        <input
          name="durationDays"
          type="number"
          placeholder="Duration in days"
          min="1"
          required
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount in rupees"
          min="1"
          required
        />

        <textarea name="description" placeholder="Description (optional)" />

        <button type="submit">Create Plan</button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Plan created successfully</h3>
            <button onClick={() => setShowSuccessModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
