import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/AdminDashboard.css";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalShops, setTotalShops] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch users
        const userRes = await fetch("https://shop-app-backend-gsx6.onrender.com/adminDashboard/getalluser");
        const userData = await userRes.json();
        const users = userData.data || [];

        setTotalUsers(users.length);

        const subscribedCount = users.reduce((count, user) => {
          return user.subscriptionId ? count + 1 : count;
        }, 0);
        setTotalSubscriptions(subscribedCount);

        // Fetch shops (shop response is directly an array)
        const shopRes = await fetch("https://shop-app-backend-gsx6.onrender.com/adminDashboard/getallshops");
        const shops = await shopRes.json();

        setTotalShops(shops.length);
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
        setTotalUsers(0);
        setTotalShops(0);
        setTotalSubscriptions(0);
      }
    }

    fetchCounts();
  }, []);

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
                User Subscription Detailst
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1 className="dashboard-content__heading">Dashboard Overview</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-card__number">{totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Shops</h3>
            <p className="stat-card__number">{totalShops}</p>
          </div>
          <div className="stat-card">
            <h3>Total Subscriptions</h3>
            <p className="stat-card__number">{totalSubscriptions}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
