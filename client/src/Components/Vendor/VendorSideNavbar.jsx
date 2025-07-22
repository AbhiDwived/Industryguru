import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function VendorSideNavbar() {
  const location = useLocation();
  const [items] = useState([
    { name: "Dashboard", path: "/vendor", icon: "fa-chart-line" },
    { name: "Profile", path: "/vendor/profile", icon: "fa-user" },
    { name: "My Products", path: "/vendor/products", icon: "fa-shopping-cart" },
    { name: "Main Categories", path: "/vendor/maincategories", icon: "fa-bars" },
    { name: "Sub Categories", path: "/vendor/subcategories", icon: "fa-bars" },
    { name: "Slugs", path: "/vendor/slugs", icon: "fa-tag" },
    { name: "Sub Slugs", path: "/vendor/sub-slugs", icon: "fa-tags" },
    { name: "Brands", path: "/vendor/brands", icon: "fa-tag" },
    { name: "Add Product", path: "/vendor/add-product", icon: "fa-plus-square" },
    { name: "Orders", path: "/vendor/orders", icon: "fa-shopping-basket" },
    { name: "Checkout", path: "/vendor/checkouts", icon: "fa-credit-card" },
    { name: "Earning Report", path: "/vendor/earning-report", icon: "fa-money-check-alt" },
    { name: "Sales Report", path: "/vendor/sales-report", icon: "fa-chart-bar" },
    { name: "Payment Info", path: "/vendor/payment", icon: "fa-wallet" },
  ]);
  
  return (
    <div className="vh-100" style={{ width: "250px", paddingTop: "20px" }}>
      <div className="p-3">
        <h4 className="text-primary mb-4">Vendor Panel</h4>
        <ul className="nav flex-column">
          {items.map((item, index) => (
            <li className="nav-item mb-1" key={index}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center px-3 py-2 rounded ${
                  location.pathname === item.path
                    ? "text-white"
                    : "text-dark"
                }`}
                style={{
                  transition: "all 0.3s ease",
                  backgroundColor: location.pathname === item.path ? "#6068bf" : "transparent",
                  borderRadius: "8px",
                }}
              >
                <i className={`fas ${item.icon} me-2`}></i>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
