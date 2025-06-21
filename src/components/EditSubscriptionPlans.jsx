import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import '../stylesheets/EditSubscriptionPlans.css';

export default function EditSubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [editPlan, setEditPlan] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPlans = async () => {
    const res = await fetch(
      'https://shop-app-backend-gsx6.onrender.com/api/subscription-plans/getallplan'
    );
    const json = await res.json();
    if (json.success) setPlans(json.plans);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleUpdate = async () => {
    const payload = {
      name: editPlan.name,
      durationDays: Number(editPlan.durationDays),
      amount: Number(editPlan.amount),
      description: editPlan.description,
    };
    const res = await fetch(
      `https://shop-app-backend-gsx6.onrender.com/api/subscription-plans/updateplan/${editPlan._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      setEditPlan(null);
      fetchPlans();
    } else {
      alert('Error updating plan');
    }
  };

  const handleDelete = async () => {
    const res = await fetch(
      `https://shop-app-backend-gsx6.onrender.com/api/subscription-plans/deleteplan/${deleteId}`,
      { method: 'DELETE' }
    );
    if (res.ok) {
      setDeleteId(null);
      fetchPlans();
    } else {
      alert('Error deleting plan');
    }
  };

  return (
    <AdminLayout>
    <div className="sub-plans-container">
      {/* Header with Back Button */}
      <div className="sp-header">
        <h1>Edit Subscription Plans</h1>
        <Link to="/admin/subscription-plans" className="edit-button">
          ← Back
        </Link>
      </div>

      <div className="sp-list">
        {plans.map(p => (
          <div className="sp-item" key={p._id}>
            <div className="sp-item-info">
              <div><b>Name:</b> {p.name}</div>
              <div><b>Days:</b> {p.durationDays}</div>
              <div><b>Amount:</b> ₹{p.amount}</div>
            </div>
            <div className="sp-item-actions">
              <button
                className="update-btn"
                onClick={() => setEditPlan({ ...p })}
              >
                Update
              </button>
              <button
                className="delete-btn"
                onClick={() => setDeleteId(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {editPlan && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Update Plan</h3>
            <input
              value={editPlan.name}
              onChange={e =>
                setEditPlan({ ...editPlan, name: e.target.value })
              }
            />
            <input
              type="number"
              value={editPlan.durationDays}
              onChange={e =>
                setEditPlan({ ...editPlan, durationDays: e.target.value })
              }
            />
            <input
              type="number"
              value={editPlan.amount}
              onChange={e =>
                setEditPlan({ ...editPlan, amount: e.target.value })
              }
            />
            <textarea
              value={editPlan.description}
              onChange={e =>
                setEditPlan({ ...editPlan, description: e.target.value })
              }
            />
            <div className="buttons">
              <button onClick={() => setEditPlan(null)}>Cancel</button>
              <button onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this plan?</p>
            <div className="buttons">
              <button onClick={() => setDeleteId(null)}>Cancel</button>
              <button onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
