import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // If we navigated away after clicking, hide the button
    if (clicked) {
      setClicked(false); // reset on new route
    }
  }, [location.pathname]);

  const handleClick = () => {
    setClicked(true);

    if (token) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  // Hide button on any route *after* it was clicked once
  if (
  clicked ||
  location.pathname.startsWith('/admin/dashboard') ||
  location.pathname.startsWith('/admin/login') ||
  location.pathname.startsWith('/admin/users') ||
  location.pathname.startsWith('/admin/shops') ||
  location.pathname.startsWith('/admin/products') ||
  location.pathname.startsWith('/admin/subscriptions')
) {
  return null;
}


  return (
    <button onClick={handleClick} style={{ padding: '8px 16px', cursor: 'pointer' }}>
      Admin Dashboard
    </button>
  );
}
