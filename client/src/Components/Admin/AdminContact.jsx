import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNavbar from './SideNavbar'
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Paper, Avatar, Chip } from '@mui/material';

import { getContactUs, deleteContactUs } from "../../Store/ActionCreators/ContactUsActionCreators"
import { useDispatch, useSelector } from 'react-redux';

export default function AdminContact() {
    var dispatch = useDispatch()
    var allContacts = useSelector((state) => state.ContactUsStateData)
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
            width: 130,
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
            field: 'email', 
            headerName: 'Email', 
            width: 230,
            renderCell: (params) => (
                <Typography variant="body2">
                    <i className="fa fa-envelope me-2" style={{ color: '#6068bf' }}></i>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'phone', 
            headerName: 'Phone', 
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2">
                    <i className="fa fa-phone me-2" style={{ color: '#6068bf' }}></i>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'subject', 
            headerName: 'Subject', 
            width: 300,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ 
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 130,
            renderCell: (params) => (
                <Chip 
                    label={params.value}
                    size="small"
                    sx={{ 
                        bgcolor: params.value === 'Active' ? '#e8eaff' : params.value === 'Done' ? '#e8f5e9' : '#ffebee',
                        color: params.value === 'Active' ? '#6068bf' : params.value === 'Done' ? '#2e7d32' : '#d32f2f',
                        fontWeight: 500,
                        border: params.value === 'Active' ? '1px solid #6068bf30' : 
                               params.value === 'Done' ? '1px solid #2e7d3230' : '1px solid #d32f2f30'
                    }}
                />
            )
        },
        { 
            field: 'date', 
            headerName: 'Date', 
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
                        navigate("/admin-single-contact/" + row._id)
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
                    <i className='fa fa-eye'></i>
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            width: 100,
            renderCell: ({ row }) =>
                row.status === "Done" ? (
                    <Button 
                        onClick={() => {
                            if (window.confirm("Are Your Sure You Want to Delete that Item :")) {
                                dispatch(deleteContactUs({ _id: row._id }))
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
                ) : null
        }
    ];
    var rows = []
    if (allContacts.length) {
        for (let item of allContacts)
            rows.push(item)
    }
    function getAPIData() {
        dispatch(getContactUs())
    }
    useEffect(() => {
      getAPIData();
      // eslint-disable-next-line
    }, [allContacts.length])
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
                                <i className="fa fa-envelope" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                                    Contact Management
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
    )
}
