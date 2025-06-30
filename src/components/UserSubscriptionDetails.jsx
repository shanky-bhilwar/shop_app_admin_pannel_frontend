import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, Crown, AlertCircle } from 'lucide-react';
import '../stylesheets/UserSubscriptionDetails.css';
import AdminLayout from './AdminLayout';

export default function UserSubscriptionDetails() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [userRes, subRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getalluser`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallsubscription`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const userData = await userRes.json();
        const subData = await subRes.json();

        setUsers(userData.data?.filter(u => u.subscriptionId) || []);
        setSubscriptions(subData.subscriptions || subData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Inline search and filter including plan match
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const mobile = user.mobileNumber?.toString() || '';
    // name or phone match
    let matchesSearch =
      user.name?.toLowerCase().includes(term) ||
      mobile.includes(term);

    // also match plan name if subscription exists
    const sub = subscriptions.find(s => s._id === user.subscriptionId);
    if (sub) {
      matchesSearch = matchesSearch || sub.plan?.toLowerCase().includes(term);
    }

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;

    const isActive = sub && new Date(sub.endDate) > new Date();
    return filterStatus === 'active' ? isActive : !isActive;
  });

  const getPlanColor = plan => {
    switch (plan?.toLowerCase()) {
      case 'premium': return 'premium-plan';
      case 'pro': return 'pro-plan';
      case 'basic': return 'basic-plan';
      default: return 'default-plan';
    }
  };

  const isSubscriptionActive = endDate => new Date(endDate) > new Date();

  if (loading) {
    return (
      <AdminLayout>
        <div className="usd-loading-container">
          <div className="usd-loading-content">
            <div className="usd-spinner"></div>
            <p className="usd-loading-text">Loading users & subscriptions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="usd-main-container">
        {/* Header */}
        <div className="usd-header">
          <h1 className="usd-title">User Subscriptions</h1>
          <p className="usd-subtitle">Monitor user subscription details</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="usd-search-container">
          <div className="usd-search-bar">
            <div className="usd-search-input-container">
              <input
                type="text"
                placeholder="Search by name, phone, or plan..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="usd-search-input"
              />
              <User className="usd-search-icon" size={20} />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="usd-filter-select"
            >
              <option value="all">All Users</option>
              <option value="active">Active Subscriptions</option>
              <option value="expired">Expired Subscriptions</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="usd-cards-grid">
          {filteredUsers.map(user => {
            const sub = subscriptions.find(s => s._id === user.subscriptionId);
            const active = sub && isSubscriptionActive(sub.endDate);

            return (
              <div key={user._id} className="usd-card">
                <div className="usd-card-header">
                  <div className="usd-user-info">
                    <div className="usd-avatar"><User size={24} /></div>
                    <div className="usd-user-details">
                      <h3 className="usd-user-name">{user.name}</h3>
                      {sub && (
                        <span className={`usd-status-badge ${active ? 'active' : 'expired'}`}>{active ? 'Active' : 'Expired'}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="usd-card-body">
                  <div className="usd-info-item"><Phone className="usd-icon phone-icon" size={20} /><span className="usd-info-text">{user.mobileNumber}</span></div>
                  <div className="usd-info-item location">
                    <MapPin className="usd-icon location-icon" size={20} />
                    <div className="usd-location-details">
                      <p className="usd-location-main">{user.state}, {user.place}</p>
                      <p className="usd-location-sub">{user.locality} - {user.pincode}</p>
                    </div>
                  </div>

                  {sub ? (
                    <div className="usd-subscription-section">
                      <div className={`usd-plan-badge ${getPlanColor(sub.plan)}`}><Crown size={16} />{sub.plan} Plan</div>
                     
                      {/* ✅ Subscription Plan Details Inserted Here */}
                    <div className="usd-info-item">
                        <span className="usd-info-text"><strong>Plan:</strong> {sub.subscriptionPlanDetails?.name || 'N/A'}</span>
                      </div>
                      <div className="usd-info-item">
                        <span className="usd-info-text"><strong>Amount:</strong> ₹{sub.amount}</span>
                      </div>
                      <div className="usd-info-item">
                        <span className="usd-info-text"><strong>Duration:</strong> {sub.durationDays} days</span>
                     </div>
                       {/* ✅ End of inserted fields */}
                     
                       {/* Separator Line */}

                  <hr className="usd-section-divider" style={{ margin: '12px 0' }} />

                        {/* Start & End Dates Section */}

                      <div className="usd-dates-grid">
                        <div className="usd-date-item"><Calendar className="usd-icon" size={16} /><div><p className="usd-date-label">Start Date</p><p className="usd-date-value">{new Date(sub.startDate).toLocaleDateString()}</p></div></div>
                        <div className="usd-date-item"><Calendar className="usd-icon" size={16} /><div><p className="usd-date-label">End Date</p><p className={`usd-date-value ${active ? 'active-date' : 'expired-date'}`}>{new Date(sub.endDate).toLocaleDateString()}</p></div></div>
                      </div>
                    </div>
                  ) : (
                    <div className="usd-no-subscription"><AlertCircle className="usd-icon" size={20} /><span>No subscription found</span></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="usd-empty-state">
            <div className="usd-empty-icon"><User size={48} /></div>
            <h3 className="usd-empty-title">No users found</h3>
            <p className="usd-empty-subtitle">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
