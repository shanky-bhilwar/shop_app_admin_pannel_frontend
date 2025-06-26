import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/AdminDashboard.css";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-dashboard">
      {/* ☰ Button will now work everywhere */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleSidebar}
        style={{ right: "1rem", left: "auto" }}
      >
        ☰
      </button>

      <aside className={`sidebar ${isSidebarOpen ? "mobile-open" : ""}`}>
        <h2 className="sidebar__title">Admin Menu</h2>
        <nav className="sidebar__nav">
          <ul>
            <li><Link to="/admin/dashboard" className="sidebar__link">Overview</Link></li>
            <li><Link to="/admin/users" className="sidebar__link">User Management</Link></li>
            <li><Link to="/admin/shops" className="sidebar__link">Shop Management</Link></li>
            <li><Link to="/admin/products" className="sidebar__link">Product Management</Link></li>
            <li><Link to="/admin/subscription-plans" className="sidebar__link">Subscription Plans</Link></li>
            <li><Link to="/admin/users/subscriptions/details" className="sidebar__link">User Subscription Details</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
