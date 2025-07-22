import React, { useState, useEffect } from "react";
import SideNavbar from "./SideNavbar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Paper, Avatar, Chip, Switch } from "@mui/material";
import { apiLink } from "../../utils/utils";
import { PaymentInfo } from "./Payments";

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

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
            bgcolor: params.value === 'Vendor' ? '#e8eaff' : '#f5f5f5',
            color: '#6068bf',
            fontWeight: 500,
            border: '1px solid #6068bf30'
          }}
        />
      )
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            checked={row.isActive}
            onChange={() => toggleVendorStatus(row._id, !row.isActive)}
            color="primary"
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#6068bf',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#6068bf',
              },
            }}
          />
          <Typography variant="body2" sx={{ ml: 1, color: row.isActive ? '#4caf50' : '#f44336' }}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      width: 100,
      renderCell: ({ row }) => (
        <Button
          onClick={() => setSelectedVendor(row)}
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
          onClick={() => deleteVendor(row._id)}
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

  async function getAPIData() {
    const response = await fetch(`${apiLink}/api/user`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    const result = await response.json();
    if (result.result === "Done") {
      // Filter only vendors
      const filteredVendors = result.data.filter((user) => user.role === "Vendor");
      setVendors(filteredVendors);
    }
  }

  async function deleteVendor(_id) {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      const response = await fetch(`${apiLink}/api/user/${_id}`, {
        method: "delete",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      await response.json();
      getAPIData(); // Refresh data after deletion
    }
  }

  async function toggleVendorStatus(_id, newStatus) {
    const response = await fetch(`${apiLink}/api/user/${_id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ isActive: newStatus }),
    });

    const result = await response.json();
    if (result.result === "Done") {
      getAPIData(); // Refresh vendor list
    } else {
      alert("Failed to update status");
    }
  }

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page_section">
      {/* Modal for Vendor Details */}
      {selectedVendor && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header" style={{ backgroundColor: '#6068bf', color: 'white', border: 'none' }}>
                <h5 className="modal-title d-flex align-items-center">
                  <i className="fa fa-store me-2"></i>
                  Vendor Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedVendor(null)}
                  style={{ filter: 'brightness(0) invert(1)' }}
                ></button>
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
                    {selectedVendor?.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" sx={{ mt: 2, color: '#333', fontWeight: 500 }}>
                    {selectedVendor?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                    <Chip 
                      label={selectedVendor?.role}
                      size="small"
                      sx={{ 
                        bgcolor: '#e8eaff',
                        color: '#6068bf',
                        fontWeight: 500,
                        border: '1px solid #6068bf30'
                      }}
                    />
                    <Chip 
                      label={selectedVendor?.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ 
                        bgcolor: selectedVendor?.isActive ? '#e8f5e9' : '#ffebee',
                        color: selectedVendor?.isActive ? '#4caf50' : '#f44336',
                        fontWeight: 500,
                        border: '1px solid ' + (selectedVendor?.isActive ? '#4caf5030' : '#f4433630')
                      }}
                    />
                  </Box>
                </div>
                <div className="row mb-4">
                  <div className="col-md-4">
                    <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                          <i className="fa fa-user me-2"></i>
                          Personal Information
                        </Typography>
                      </Box>
                      <Box p={2}>
                        <table className="table">
                          <tbody>
                            <tr>
                              <th style={{ width: "120px", backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                <i className="fa fa-id-card me-2" style={{ color: '#6068bf' }}></i>
                                Vendor ID
                              </th>
                              <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?._id}</td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                <i className="fa fa-envelope me-2" style={{ color: '#6068bf' }}></i>
                                Email
                              </th>
                              <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.email}</td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                <i className="fa fa-phone me-2" style={{ color: '#6068bf' }}></i>
                                Phone
                              </th>
                              <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.phone}</td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                <i className="fa fa-id-badge me-2" style={{ color: '#6068bf' }}></i>
                                PAN
                              </th>
                              <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.pan || 'Not provided'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Box>
                    </Paper>
                  </div>
                  <div className="col-md-8">
                    <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                          <i className="fa fa-university me-2"></i>
                          Bank Details
                        </Typography>
                      </Box>
                      <Box p={2}>
                        <div className="row">
                          <div className="col-md-6">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th style={{ width: "140px", backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                    <i className="fa fa-user me-2" style={{ color: '#6068bf' }}></i>
                                    Account Holder
                                  </th>
                                  <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.bank_ac_name || 'Not provided'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                    <i className="fa fa-university me-2" style={{ color: '#6068bf' }}></i>
                                    Bank Name
                                  </th>
                                  <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.bank_name || 'Not provided'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                    <i className="fa fa-map-marker me-2" style={{ color: '#6068bf' }}></i>
                                    Branch
                                  </th>
                                  <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.bank_branch || 'Not provided'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-md-6">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th style={{ width: "140px", backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                    <i className="fa fa-hashtag me-2" style={{ color: '#6068bf' }}></i>
                                    Account No
                                  </th>
                                  <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.bank_no || 'Not provided'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#f9f9ff', borderRadius: '8px 0 0 8px' }}>
                                    <i className="fa fa-code me-2" style={{ color: '#6068bf' }}></i>
                                    IFSC
                                  </th>
                                  <td style={{ borderRadius: '0 8px 8px 0' }}>{selectedVendor?.bank_ifsc || 'Not provided'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Box>
                    </Paper>
                  </div>
                </div>

                {/* Payment info section with improved styling */}
                <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                      <i className="fa fa-money-bill me-2"></i>
                      Payment Information
                    </Typography>
                  </Box>
                  <Box p={2}>
                    <PaymentInfo user={selectedVendor} />
                  </Box>
                </Paper>
              </div>
              <div className="modal-footer" style={{ border: 'none' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSelectedVendor(null)}
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
                <i className="fa fa-store" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Vendors Management
                </Typography>
              </Box>
              
              <Box sx={{ height: 450, width: "100%", p: 2 }}>
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
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}