import React, { useEffect } from 'react'
import SideNavbar from './SideNavbar'
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Paper, Chip } from '@mui/material';

import { getNewslatter, deleteNewslatter } from "../../Store/ActionCreators/NewslatterActionCreators"
import { useDispatch, useSelector } from 'react-redux';

export default function Newslatter() {
    var dispatch = useDispatch()
    var allNewslatters = useSelector((state) => state.NewslatterStateData)
    const columns = [
        { 
            field: '_id', 
            headerName: 'ID', 
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
                    {params.value}
                </Typography>
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
            field: "delete",
            headerName: "Delete",
            sortable: false,
            width: 100,
            renderCell: ({ row }) => (
                <Button 
                    onClick={() => {
                        if (window.confirm("Are Your Sure You Want to Delete that Item :")) {
                            dispatch(deleteNewslatter({ _id: row._id }))
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
    if (allNewslatters.length) {
        for (let item of allNewslatters)
            rows.push(item)
    }
    function getAPIData() {
        dispatch(getNewslatter())
    }
    useEffect(() => {
      getAPIData();
      // eslint-disable-next-line
    }, [allNewslatters.length])
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
                                <i className="fa fa-star" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                                    Newsletter Management
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
