import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import { apiLink } from "../../utils/utils";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@mui/material";

// Placeholder components (to replace once actual components are ready)
const SalesReport = ({ salesReport }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      height: '100%',
      borderRadius: '12px',
      border: '1px solid #e0e0e0'
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>Sales Report Placeholder</Typography>
  </Paper>
);

const OrderReport = ({ orderReport }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      height: '100%',
      borderRadius: '12px',
      border: '1px solid #e0e0e0'
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>Order Report Placeholder</Typography>
  </Paper>
);

const EarningReports = ({ earningReport }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      height: '100%',
      borderRadius: '12px',
      border: '1px solid #e0e0e0'
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>Earning Report Placeholder</Typography>
  </Paper>
);

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrder: 0,
    totalEarning: 0,
    totalPending: 0,
    orderReport: [],
    salesReport: {
      labels: [],
      datasets: [],
    },
    earningReport: {
      labels: [],
      datasets: [],
    },
  });

  const [search, setSearch] = useState("7days");
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  

  async function getAPIData() {
    try {
      const response = await fetch(
        `${apiLink}/api/user/` + localStorage.getItem("userid"),
        {
          method: "get",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();
      if (result.result === "Done") {
        setData((prev) => ({
          ...prev,
          ...result.data, // Assuming the API returns an object with aggregated data
        }));
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      navigate("/login");
    }
  }

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [search]);

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
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                mb: 3
              }}
            >
              <Box sx={{ 
                bgcolor: '#6068bf', 
                p: 2, 
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <i className="fa fa-tachometer-alt" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Dashboard
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                {/* Filters */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth 
                      variant="outlined" 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#6068bf',
                          },
                        },
                      }}
                    >
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        label="Filter"
                      >
                        <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                        <MenuItem value={"month"}>Current Month</MenuItem>
                        <MenuItem value={"lastmonth"}>Last Month</MenuItem>
                        <MenuItem value={"last3month"}>Last 3 Months</MenuItem>
                        <MenuItem value={"last6month"}>Last 6 Months</MenuItem>
                        <MenuItem value={"last12month"}>Last 12 Months</MenuItem>
                        <MenuItem value={"year"}>This Year</MenuItem>
                        <MenuItem value={"lastyear"}>Last Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Key Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        position: 'relative',
                        overflow: 'visible',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: '-20px',
                            left: '20px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            backgroundColor: '#6068bf',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <i className="fa fa-wallet" style={{ fontSize: '1.5rem' }}></i>
                        </Box>
                        <Box sx={{ pt: 3, pl: 1 }}>
                          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                            Total Earnings
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#6068bf' }}>
                            ₹{data?.totalEarning || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        position: 'relative',
                        overflow: 'visible',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: '-20px',
                            left: '20px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            backgroundColor: '#6068bf',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <i className="fa fa-shopping-basket" style={{ fontSize: '1.5rem' }}></i>
                        </Box>
                        <Box sx={{ pt: 3, pl: 1 }}>
                          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                            Daily Orders
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#6068bf' }}>
                            {data?.totalOrder || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        position: 'relative',
                        overflow: 'visible',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: '-20px',
                            left: '20px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            backgroundColor: '#6068bf',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <i className="fa fa-shopping-cart" style={{ fontSize: '1.5rem' }}></i>
                        </Box>
                        <Box sx={{ pt: 3, pl: 1 }}>
                          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                            Total Products
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#6068bf' }}>
                            {data?.totalProducts || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        position: 'relative',
                        overflow: 'visible',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: '-20px',
                            left: '20px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            backgroundColor: '#6068bf',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <i className="fa fa-shopping-basket" style={{ fontSize: '1.5rem' }}></i>
                        </Box>
                        <Box sx={{ pt: 3, pl: 1 }}>
                          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                            Pending Orders
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#6068bf' }}>
                            {data?.totalPending || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Reports */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        mb: 3
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: '#f5f5f5', 
                        p: 2, 
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                          <i className="fa fa-chart-line me-2"></i>
                          Sales Report
                        </Typography>
                      </Box>
                      <Box sx={{ height: 220 }}>
                        <SalesReport salesReport={data.salesReport} />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        mb: 3
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: '#f5f5f5', 
                        p: 2, 
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                          <i className="fa fa-shopping-cart me-2"></i>
                          Order Report
                        </Typography>
                      </Box>
                      <Box sx={{ height: 220 }}>
                        <OrderReport orderReport={data.orderReport} />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        mb: 3
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: '#f5f5f5', 
                        p: 2, 
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                          <i className="fa fa-chart-bar me-2"></i>
                          Earning Report
                        </Typography>
                      </Box>
                      <Box sx={{ height: 220 }}>
                        <EarningReports earningReport={data.earningReport} />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}