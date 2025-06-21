// src/components/AdminLayout.jsx
import { Link } from "react-router-dom";
import "../stylesheets/AdminDashboard.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar__title">Admin Menu</h2>
        <nav className="sidebar__nav">
          <ul>
             <li>
              <Link to="/admin/dashboard" className="sidebar__link">
                Overview
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="sidebar__link">
                User Management
              </Link>
            </li>
            <li>
              <Link to="/admin/shops" className="sidebar__link">
                Shop Management
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="sidebar__link">
                Product Management
              </Link>
            </li>
            <li>
              <Link to="/admin/subscription-plans" className="sidebar__link">
                Subscription Plans Management
              </Link>
            </li>
            <li>
              <Link to="/admin/users/subscriptions/details" className="sidebar__link">
                User Subscription Details
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
