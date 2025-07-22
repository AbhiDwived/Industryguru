import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiLink } from '../../utils/utils';

const ProtectedVendorRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in as vendor
        const isLoggedIn = localStorage.getItem("login") === "true";
        const role = localStorage.getItem("role");
        const isApproved = localStorage.getItem("isApproved") === "true";
        
        if (!isLoggedIn || role !== "Vendor") {
          console.log("Not logged in as vendor");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (!isApproved) {
          console.log("Vendor not approved");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // If all checks pass, user is authenticated
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Check if user is logged in but not approved
    const isLoggedIn = localStorage.getItem("login") === "true";
    const role = localStorage.getItem("role") === "Vendor";
    const isApproved = localStorage.getItem("isApproved") === "true";
    
    if (isLoggedIn && role && !isApproved) {
      return <Navigate to="/vendor-approval-pending" replace />;
    }
    
    // Otherwise redirect to login
    return <Navigate to="/vendor-login" replace />;
  }

  return children;
};

export default ProtectedVendorRoute; 