import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SideNavbar from './SideNavbar'
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Paper, Avatar, Chip } from '@mui/material';

import { getMaincategory, deleteMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators"
import { useDispatch, useSelector } from 'react-redux';

export default function Maincategory() {
    var dispatch = useDispatch()
    var allmaincategories = useSelector((state) => state.MaincategoryStateData)
    var navigate = useNavigate()
    
    const columns = [
        { 
            field: '_id', 
            headerName: 'ID', 
            width: 220,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'name', 
            headerName: 'Name', 
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
            field: "edit",
            headerName: "Edit",
            sortable: false,
            width: 100,
            renderCell: ({ row }) => (
                <Button 
                    onClick={() => {
                        navigate("/admin-update-maincategory/" + row._id)
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
                    <i className='fa fa-edit'></i>
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
                    onClick={() => {
                        if (window.confirm("Are Your Sure You Want to Delete that Item :")) {
                            dispatch(deleteMaincategory({ _id: row._id }))
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
                    <i className='fa fa-trash'></i>
                </Button>
            ),
        }
    ];
    
    var rows = []
    if (allmaincategories.length) {
        for (let item of allmaincategories)
            rows.push(item)
    }
    
    function getAPIData() {
        dispatch(getMaincategory())
    }
    
    useEffect(() => {
      getAPIData();
      // eslint-disable-next-line
    }, [allmaincategories.length])
    
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
                                    <i className="fa fa-list" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                                        Main Categories
                                    </Typography>
                                </Box>
                                <Link to="/admin-add-maincategory">
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
    )
}
