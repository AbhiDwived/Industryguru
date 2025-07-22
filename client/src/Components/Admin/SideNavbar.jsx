import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Paper,
  Avatar
} from "@mui/material";

export default function AdminSideNavbar() {
  const location = useLocation();
  
  const items = [
    { name: "Dashboard", path: "/admin-dashboard", icon: "fa-tachometer-alt" },
    { name: "Users", path: "/admin-users", icon: "fa-users" },
    { name: "Vendors", path: "/admin-vendor-list", icon: "fa-user-tie" },
    { name: "Vendor Approvals", path: "/admin/vendor-approval", icon: "fa-user-check" },
    { name: "Main Categories", path: "/admin-maincategories", icon: "fa-bars" },
    { name: "Sub Categories", path: "/admin-subcategories", icon: "fa-list" },
    { name: "Brands", path: "/admin-brands", icon: "fa-tag" },
    { name: "Products", path: "/admin-products", icon: "fa-th-large" },
    { name: "Slugs", path: "/admin-slugs", icon: "fa-link" },
    { name: "Sub Slugs", path: "/admin-subslugs", icon: "fa-sitemap" },
    { name: "Vendor Payments", path: "/admin-payments", icon: "fa-wallet" },
    { name: "Contact", path: "/admin-contacts", icon: "fa-envelope" },
    { name: "Checkouts", path: "/admin-checkouts", icon: "fa-shopping-cart" },
    { name: "NewsLetter", path: "/admin-newslatters", icon: "fa-star" },
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%',
        borderRadius: '16px', 
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ 
        bgcolor: '#6068bf', 
        p: 2, 
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar 
          sx={{ 
            bgcolor: 'white',
            color: '#6068bf',
            fontWeight: 'bold',
            width: 40,
            height: 40
          }}
        >
          A
        </Avatar>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
          Admin Panel
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <List sx={{ p: 0 }}>
          <ListItem 
            component={Link} 
            to="/admin"
            sx={{
              borderRadius: '8px',
              mb: 1,
              color: location.pathname === "/admin" ? 'white' : '#333',
              bgcolor: location.pathname === "/admin" ? '#6068bf' : 'transparent',
              '&:hover': {
                bgcolor: location.pathname === "/admin" ? '#4c53a9' : '#f5f5f5',
                textDecoration: 'none'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: location.pathname === "/admin" ? 'white' : '#6068bf' }}>
              <i className="fa fa-home"></i>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          
          <Divider sx={{ my: 2 }} />
          
          {items.map((item, index) => (
            <ListItem 
              key={index}
              component={Link} 
              to={item.path}
              sx={{
                borderRadius: '8px',
                mb: 1,
                color: location.pathname === item.path ? 'white' : '#333',
                bgcolor: location.pathname === item.path ? '#6068bf' : 'transparent',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? '#4c53a9' : '#f5f5f5',
                  textDecoration: 'none'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: location.pathname === item.path ? 'white' : '#6068bf' }}>
                <i className={`fa ${item.icon}`}></i>
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
