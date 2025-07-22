import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLink } from '../utils/utils';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('signup-user');
    if (!email) {
      alert('No email found for verification.');
      return;
    }

    try {
      const response = await fetch(`${apiLink}/api/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.result === 'Done') {
        alert('Account verified successfully! You can now log in.');
        localStorage.removeItem('signup-user');
        navigate('/login');
      } else {
        alert(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="container-fluid">
        <div className="sign-up-login mx-auto">
          <h3 className="text-center">Verify Your Account</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="ui__form">
              <label htmlFor="otp" className="ui__form__label">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter the OTP sent to your phone"
                className="ui__form__field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="ui__form__button">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}