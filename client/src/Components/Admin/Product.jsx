import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Paper, Avatar, Chip } from "@mui/material";

import { getProduct, deleteProduct } from "../../Store/ActionCreators/ProductActionCreators";
import { useDispatch, useSelector } from "react-redux";
import { apiLink } from "../../utils/utils";

export default function Product() {
  var dispatch = useDispatch();
  var allproducts = useSelector((state) => state.ProductStateData);
  var navigate = useNavigate();
  
  const columns = [
    {
      field: "view",
      headerName: "View",
      sortable: false,
      width: 80,
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            navigate("/single-product/" + row._id);
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
    { 
      field: "_id", 
      headerName: "ID", 
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: "name", 
      headerName: "Name", 
      width: 220,
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
      field: "maincategory", 
      headerName: "Maincategory", 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: '#e8eaff',
            color: '#6068bf',
            fontWeight: 500,
            border: '1px solid #6068bf30'
          }}
        />
      )
    },
    { 
      field: "subcategory", 
      headerName: "Subcategory", 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: '#f0f4ff',
            color: '#6068bf',
            fontWeight: 500,
            border: '1px solid #6068bf30'
          }}
        />
      )
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Chip 
            label={row?.brand?._id || "N/A"}
            size="small"
            sx={{ 
              bgcolor: '#f5f5f5',
              color: '#6068bf',
              fontWeight: 500,
              border: '1px solid #6068bf30'
            }}
          />
        );
      },
    },
    { 
      field: "color", 
      headerName: "Color", 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '4px', 
              backgroundColor: params.value,
              border: '1px solid #ddd'
            }} 
          />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: "size", 
      headerName: "Size", 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: '#f5f5f5',
            color: '#333',
            fontWeight: 500,
            border: '1px solid #ddd'
          }}
        />
      )
    },
    {
      field: "baseprice",
      headerName: "Base Price",
      width: 130,
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          ₹{row.baseprice}
        </Typography>
      ),
    },
    {
      field: "discount",
      headerName: "Discount",
      width: 130,
      renderCell: ({ row }) => (
        <Chip 
          label={`${row.discount}% Off`}
          size="small"
          sx={{ 
            bgcolor: '#ffebee',
            color: '#f44336',
            fontWeight: 500,
            border: '1px solid #f4433630'
          }}
        />
      ),
    },
    {
      field: "finalprice",
      headerName: "Final Price",
      width: 130,
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#6068bf' }}>
          ₹{row.finalprice}
        </Typography>
      ),
    },
    { 
      field: "stock", 
      headerName: "Stock", 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: params.value > 0 ? '#e8f5e9' : '#ffebee',
            color: params.value > 0 ? '#4caf50' : '#f44336',
            fontWeight: 500,
            border: `1px solid ${params.value > 0 ? '#4caf5030' : '#f4433630'}`
          }}
        />
      )
    },
    {
      field: "pic1",
      headerName: "Pic1",
      width: 130,
      renderCell: ({ row }) => {
        return (
          <a
            href={`${apiLink}/public/products/${row.pic1}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
              }}
            >
              <img
                src={`${apiLink}/products/${row.pic1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}>
                <i className="fa fa-image" style={{ color: '#ccc' }}></i>
              </div>
            </Box>
          </a>
        );
      },
    },
    {
      field: "pic2",
      headerName: "Pic2",
      width: 130,
      renderCell: ({ row }) => {
        return (
          <a
            href={`${apiLink}/public/products/${row.pic2}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
              }}
            >
              <img
                src={`${apiLink}/public/products/${row.pic2}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
              />
            </Box>
          </a>
        );
      },
    },
    {
      field: "pic3",
      headerName: "Pic3",
      width: 130,
      renderCell: ({ row }) => {
        return (
          <a
            href={`${apiLink}/public/products/${row.pic3}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
              }}
            >
              <img
                src={`${apiLink}/public/products/${row.pic3}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
              />
            </Box>
          </a>
        );
      },
    },
    {
      field: "pic4",
      headerName: "Pic4",
      width: 130,
      renderCell: ({ row }) => {
        return (
          <a
            href={`${apiLink}/public/products/${row.pic4}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
              }}
            >
              <img
                src={`${apiLink}/public/products/${row.pic4}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
              />
            </Box>
          </a>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      width: 80,
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            navigate("/admin-update-product/" + row._id);
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
          <i className="fa fa-edit"></i>
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      width: 80,
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            if (
              window.confirm("Are Your Sure You Want to Delete that Item :")
            ) {
              dispatch(deleteProduct({ _id: row._id }));
            }
          }}
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
  
  var rows = [];
  if (allproducts.length) {
    for (let item of allproducts) rows.push(item);
  }
  
  function getAPIData() {
    dispatch(getProduct());
  }
  
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allproducts.length]);
  
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
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <i className="fa fa-shopping-bag" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                    Products
                  </Typography>
                </Box>
                <Link to="/admin-add-product">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<i className="fa fa-plus"></i>}
                    sx={{ 
                      bgcolor: 'white', 
                      color: '#6068bf',
                      '&:hover': {
                        bgcolor: '#e8eaff',
                      }
                    }}
                  >
                    Add New
                  </Button>
                </Link>
              </Box>
              
              <Box sx={{ height: 600, width: "100%", p: 2 }}>
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
