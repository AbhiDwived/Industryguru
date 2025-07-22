import React, { useState, useEffect } from "react";
import SideNavbar from "./SideNavbar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Paper, Avatar, Chip } from "@mui/material";
import { apiLink } from "../../utils/utils";
// import PaymentInfo from "./Payments";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Columns configuration for the DataGrid with enhanced styling
  const columns = [
    { 
      field: "_id", 
      headerName: "ID", 
      width: 220,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: "name", 
      headerName: "Name", 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: '#6068bf',
              fontSize: '0.9rem'
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body1">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2">
          <i className="fa fa-envelope me-2" style={{ color: '#6068bf' }}></i>
          {params.value}
        </Typography>
      )
    },
    { 
      field: "phone", 
      headerName: "Phone", 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          <i className="fa fa-phone me-2" style={{ color: '#6068bf' }}></i>
          {params.value}
        </Typography>
      )
    },
    { 
      field: "role", 
      headerName: "Role", 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: params.value === 'User' ? '#e8eaff' : '#f5f5f5',
            color: '#6068bf',
            fontWeight: 500,
            border: '1px solid #6068bf30'
          }}
        />
      )
    },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      width: 100,
      renderCell: ({ row }) => (
        <Button
          onClick={() => setSelectedUser(row)}
          variant="outlined"
          size="small"
          sx={{ 
            minWidth: '36px',
            height: '36px',
            borderRadius: '8px',
            color: '#6068bf',
            borderColor: '#6068bf',
            '&:hover': {
              backgroundColor: '#e8eaff',
              borderColor: '#6068bf'
            }
          }}
        >
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      width: 100,
      renderCell: ({ row }) => (
        <Button
          onClick={() => deleteUser(row._id)}
          variant="outlined"
          size="small"
          sx={{ 
            minWidth: '36px',
            height: '36px',
            borderRadius: '8px',
            color: '#dc3545',
            borderColor: '#dc3545',
            '&:hover': {
              backgroundColor: '#ffebee',
              borderColor: '#dc3545'
            }
          }}
        >
          <i className="fa fa-trash"></i>
        </Button>
      ),
    },
  ];

  // Fetch user data from the API
  async function fetchUsers() {
    try {
      const response = await fetch(`${apiLink}/api/user`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      if (result.result === "Done") {
        // Filter only users with role 'User'
        const onlyUsers = result.data.filter((user) => user.role === "User");
        setUsers(onlyUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  

  // Delete a user by ID
  async function deleteUser(userId) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${apiLink}/api/user/${userId}`, {
          method: "delete",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        });
        await response.json();
        fetchUsers(); // Refresh the user list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page_section">
      {/* Modal for User Details */}
      {selectedUser && (
        <UserInfo user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Main Page Layout */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-12">
            <SideNavbar />
          </div>
          <div className="col-md-9 col-12">
            <Paper 
              elevation={0} 
              sx={{ 
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
                <i className="fa fa-users" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Users Management
                </Typography>
              </Box>
              
              <Box sx={{ height: 450, width: "100%", p: 2 }}>
                <DataGrid
                  getRowId={(row) => row._id}
                  rows={users}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      mb: 1
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #f0f0f0'
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#f9f9ff'
                    }
                  }}
                />
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserInfo({ user, onClose }) {
  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="modal-header" style={{ backgroundColor: '#6068bf', color: 'white', border: 'none' }}>
            <h5 className="modal-title d-flex align-items-center">
              <i className="fa fa-user-circle me-2"></i>
              {user?.role === "Vendor" ? "Vendor Details" : "User Details"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} style={{ filter: 'brightness(0) invert(1)' }}></button>
          </div>
          <div className="modal-body">
            <div className="text-center mb-4">
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: '#6068bf',
                  fontSize: '2rem',
                  margin: '0 auto'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2, color: '#333', fontWeight: 500 }}>
                {user?.name}
              </Typography>
              <Chip 
                label={user?.role}
                size="small"
                sx={{ 
                  mt: 1,
                  bgcolor: user?.role === 'User' ? '#e8eaff' : '#f5f5f5',
                  color: '#6068bf',
                  fontWeight: 500,
                  border: '1px solid #6068bf30'
                }}
              />
            </div>
            <div className="row">
              <div className="col-md-12">
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row" style={{ width: "120px", backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                        <i className="fa fa-id-card me-2" style={{ color: '#6068bf' }}></i>
                        ID
                      </th>
                      <td style={{ borderRadius: '0 8px 8px 0' }}>{user?._id}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                        <i className="fa fa-envelope me-2" style={{ color: '#6068bf' }}></i>
                        Email
                      </th>
                      <td style={{ borderRadius: '0 8px 8px 0' }}>{user?.email}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                        <i className="fa fa-phone me-2" style={{ color: '#6068bf' }}></i>
                        Phone
                      </th>
                      <td style={{ borderRadius: '0 8px 8px 0' }}>{user?.phone}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                        <i className="fa fa-user me-2" style={{ color: '#6068bf' }}></i>
                        Username
                      </th>
                      <td style={{ borderRadius: '0 8px 8px 0' }}>{user?.username}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ border: 'none' }}>
            <button 
              type="button" 
              className="btn" 
              onClick={onClose}
              style={{ 
                backgroundColor: '#6068bf', 
                color: 'white',
                borderRadius: '8px',
                padding: '8px 20px'
              }}
            >
              <i className="fa fa-times me-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
