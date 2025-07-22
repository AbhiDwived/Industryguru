import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import { Box, Typography, Paper, Avatar, Chip, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { apiLink } from '../../utils/utils';

export default function VendorApproval() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      const response = await fetch(`${apiLink}/api/admin/pending-vendors`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      const data = await response.json();
      if (data.result === "Done") {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    try {
      const response = await fetch(`${apiLink}/api/vendor/approve/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.result === "Done") {
        // Remove approved vendor from list
        setVendors(vendors.filter(v => v._id !== vendorId));
        alert('Vendor approved successfully!');
      } else {
        alert(data.message || 'Failed to approve vendor');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to approve vendor');
    }
  };

  // Define columns for DataGrid
  const columns = [
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
            {params.value?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="body1">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 220,
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
      field: "company", 
      headerName: "Company", 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          <i className="fa fa-building me-2" style={{ color: '#6068bf' }}></i>
          {params.value || 'N/A'}
        </Typography>
      )
    },
    { 
      field: "shopName", 
      headerName: "Shop Name", 
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          <i className="fa fa-store me-2" style={{ color: '#6068bf' }}></i>
          {params.value || 'N/A'}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: ({ row }) => (
        <Button
          onClick={() => handleApprove(row._id)}
          variant="contained"
          size="small"
          sx={{ 
            borderRadius: '8px',
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#388e3c',
            }
          }}
        >
          <i className="fa fa-check me-2"></i>
          Approve
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="page_section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3"><SideNavbar /></div>
            <div className="col-md-9">
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '400px' 
                }}
              >
                <div className="spinner-border" style={{ color: '#6068bf', width: '3rem', height: '3rem' }} />
              </Box>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <SideNavbar />
          </div>
          <div className="col-md-9">
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
                <i className="fa fa-user-check" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Vendor Approval Management
                </Typography>
              </Box>
              
              <Box sx={{ p: 2 }}>
                {vendors.length === 0 ? (
                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: '8px', 
                      backgroundColor: '#e8f4fd', 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <i className="fa fa-info-circle" style={{ color: '#0288d1', fontSize: '1.5rem' }}></i>
                    <Typography variant="body1" sx={{ color: '#0288d1' }}>
                      No pending vendor approvals.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 450, width: "100%" }}>
                    <DataGrid
                      getRowId={(row) => row._id}
                      rows={vendors}
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
                )}
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
} 