import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Paper, Avatar, Chip } from "@mui/material";

import { getCheckout } from "../../Store/ActionCreators/CheckoutActionCreators";
import { useDispatch, useSelector } from "react-redux";

export default function AdminCheckout() {
  var dispatch = useDispatch();
  var allCheckouts = useSelector((state) => state.CheckoutStateData);
  var navigate = useNavigate();
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
      field: "orderstatus", 
      headerName: "Order Status", 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: 
              params.value === 'Order Placed' ? '#e8eaff' : 
              params.value === 'Packed' ? '#e3f2fd' : 
              params.value === 'Shipped' ? '#e8f5e9' : 
              params.value === 'Delivered' ? '#e8f5e9' : '#ffebee',
            color: 
              params.value === 'Order Placed' ? '#6068bf' : 
              params.value === 'Packed' ? '#1976d2' : 
              params.value === 'Shipped' ? '#2e7d32' : 
              params.value === 'Delivered' ? '#2e7d32' : '#d32f2f',
            fontWeight: 500,
            border: '1px solid #6068bf30'
          }}
        />
      )
    },
    { 
      field: "paymentmode", 
      headerName: "Payment Mode", 
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          <i className={`fa ${params.value === 'COD' ? 'fa-money' : 'fa-credit-card'} me-2`} style={{ color: '#6068bf' }}></i>
          {params.value}
        </Typography>
      )
    },
    { 
      field: "paymentstatus", 
      headerName: "Payment Status", 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: params.value === 'Success' ? '#e8f5e9' : params.value === 'Pending' ? '#fff8e1' : '#ffebee',
            color: params.value === 'Success' ? '#2e7d32' : params.value === 'Pending' ? '#f57c00' : '#d32f2f',
            fontWeight: 500,
            border: params.value === 'Success' ? '1px solid #2e7d3230' : 
                   params.value === 'Pending' ? '1px solid #f57c0030' : '1px solid #d32f2f30'
          }}
        />
      )
    },
    { 
      field: "userid", 
      headerName: "User Id", 
      width: 220,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
          <i className="fa fa-user me-2" style={{ color: '#6068bf' }}></i>
          {params.value}
        </Typography>
      )
    },
    {
      field: "subtotal",
      headerName: "Sub Total",
      width: 110,
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <i className="fa fa-inr me-1" style={{ color: '#6068bf' }}></i>
          {row.subtotal}
        </Typography>
      ),
    },
    {
      field: "shipping",
      headerName: "Shipping",
      width: 110,
      renderCell: ({ row }) => (
        <Typography variant="body2">
          <i className="fa fa-truck me-1" style={{ color: '#6068bf' }}></i>
          ₹{row.shipping}
        </Typography>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      width: 110,
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6068bf' }}>
          <i className="fa fa-inr me-1"></i>
          {row.total}
        </Typography>
      ),
    },
    { 
      field: "date", 
      headerName: "Date", 
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#666' }}>
          <i className="fa fa-calendar me-2" style={{ color: '#6068bf' }}></i>
          {params.value}
        </Typography>
      )
    },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      width: 100,
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            navigate("/admin-single-checkout/" + row._id);
          }}
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
  ];
  var rows = [];
  if (allCheckouts.length) {
    for (let item of allCheckouts) rows.push(item);
  }
  function getAPIData() {
    dispatch(getCheckout());
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allCheckouts.length]);
  return (
    <div className="page_section">
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
                <i className="fa fa-shopping-cart" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Checkout Management
                </Typography>
              </Box>
              
              <Box sx={{ height: 450, width: "100%", p: 2 }}>
                <DataGrid
                  getRowId={(row) => row._id}
                  rows={rows}
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
