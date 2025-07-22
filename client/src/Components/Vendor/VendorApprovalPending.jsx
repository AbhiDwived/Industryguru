import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLink } from '../../utils/utils';

export default function VendorApprovalPending() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('login') === 'true';
    const isVendor = localStorage.getItem('role') === 'Vendor';
    
    if (!isLoggedIn || !isVendor) {
      navigate('/vendor-login');
      return;
    }
    
    // Check approval status
    const checkApprovalStatus = async () => {
      try {
        const userId = localStorage.getItem('userid');
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiLink}/api/vendor/status/${userId}`, {
          headers: {
            'Authorization': token
          }
        });
        
        const data = await response.json();
        
        if (data.result === 'Done' && data.isApproved) {
          // Update localStorage
          localStorage.setItem('isApproved', 'true');
          // Redirect to vendor dashboard
          navigate('/vendor');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };
    
    // Check status when component mounts
    checkApprovalStatus();
    
    // Set up interval to check status every 30 seconds
    const interval = setInterval(checkApprovalStatus, 30000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const vendorInfo = {
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    phone: localStorage.getItem('phone'),
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/vendor-login');
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        padding: "20px",
      }}
    >
      <div
        className="shadow p-5 bg-white rounded-4 text-center"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-4">
          <i
            className="fas fa-clock"
            style={{
              fontSize: "4rem",
              color: "#ffc107",
              marginBottom: "1rem"
            }}
          ></i>
          <h2 className="fw-bold mb-3">Account Pending Approval</h2>
          <div className="alert alert-warning">
            Your vendor account is currently under review by our admin team.
          </div>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold">Account Details</h5>
          <p className="mb-1">Name: {vendorInfo.name}</p>
          <p className="mb-1">Email: {vendorInfo.email}</p>
          <p className="mb-3">Phone: {vendorInfo.phone}</p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold">What's Next?</h5>
          <p>Our admin team will review your application and approve it shortly.</p>
          <p>For urgent inquiries, please contact:</p>
          <p className="mb-1">📧 Email: admin@industryguru.com</p>
          <p>📞 Phone: +91 9810092418</p>
        </div>

        <button
          onClick={handleLogout}
          className="btn text-white fw-semibold"
          style={{
            background: "linear-gradient(to right, #00c6ff, #bc00dd)",
            border: "none",
            borderRadius: "25px",
            padding: "10px 30px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
} 