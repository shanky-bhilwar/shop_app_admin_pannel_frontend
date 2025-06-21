import { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = { email, mobileNumber, password };

    try {
      const res = await fetch('https://shop-app-backend-gsx6.onrender.com/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMsg(errorData.message || 'Login failed');
        return;
      }

      const data = await res.json();

      if (!data.token) {
        setErrorMsg('Token not received. Try again.');
        return;
      }

      // ✅ Save token to localStorage
      localStorage.setItem('adminToken', data.token);

      // ✅ Example usage: send token in future API request (can be reused elsewhere)
      const protectedRes = await fetch('https://shop-app-backend-gsx6.onrender.com/admin/protected-data', {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      });
      const protectedData = await protectedRes.json();
      console.log('Protected data:', protectedData);

      // ✅ Redirect to dashboard
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Server error. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="bg-element bg-element-1"></div>
      <div className="bg-element bg-element-2"></div>
      <div className="bg-element bg-element-3"></div>
      <div className="bg-element bg-element-4"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="header-icon">
            <Shield color="white" size={32} />
          </div>
          <h1 className="header-title">Admin Portal</h1>
          <p className="header-subtitle">Welcome back! Please sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="new-email"
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={20} />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                autoComplete="new-tel"
                className="form-input"
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="form-input password-input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">Secure admin access • Protected by encryption</p>
        </div>
      </div>
    </div>
  );
}
