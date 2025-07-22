import React, { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import {
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  Grid
} from "@mui/material";
import {
  addVendorPaymentAPI,
  getAdminPayment,
  getAdminVendorList,
} from "../../Store/Services/ProductService";

import * as Yup from "yup";
import { Form, Formik, Field } from "formik";

function formatShortDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default function Payments() {
  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-12">
            <SideNavbar />
          </div>
          <div className="col-md-9 col-12">
            <PaymentInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentInfo({ user }) {
  const [allproducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().getTime());
  
  const [users, setUsers] = useState(user?._id ? [
    user
  ] : []);
  const limit = 10;
  function getAPIData() {
    getAdminPayment(page, search, user?._id ?? "").then((data) => {
      setAllProducts(data?.data || []);
      setCount(data?.count || 0);
    });
  }

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    if ( !user?._id )
      getAdminVendorList().then((data) => {
        setUsers(data?.data);
      });
  }, [])

  function resetData() {
    setPage(0);
    setSearch("");
    setDate(new Date().getTime());
  }

  const [modal, setModal] = useState(false);
  return (
    <>
      {modal && (
        <AddPayment setModal={setModal} getAPIData={resetData} users={users} />
      )}

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
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <i className="fa fa-money" style={{ color: 'white', fontSize: '1.5rem' }}></i>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
              Payments Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<i className="fa fa-plus"></i>}
            onClick={() => setModal(true)}
            sx={{ 
              bgcolor: 'white', 
              color: '#6068bf',
              '&:hover': {
                bgcolor: '#e8eaff',
              }
            }}
          >
            Add Payment
          </Button>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search By ID"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#6068bf',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fa fa-search" style={{ color: '#6068bf' }}></i>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setDate(new Date().getTime());
                      }}
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: '#6068bf',
                        '&:hover': {
                          backgroundColor: '#4c53a9',
                        }
                      }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vendor ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment Mode</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment Reference</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>GST</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Commission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allproducts.length > 0 ? (
                  allproducts.map((item) => (
                    <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: '#f9f9ff' } }}>
                      <TableCell sx={{ fontSize: '0.8rem', color: '#666' }}>{item._id}</TableCell>
                      <TableCell>{item.userid}</TableCell>
                      <TableCell>{formatShortDate(new Date(item.createdAt))}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.mode}
                          size="small"
                          sx={{ 
                            bgcolor: '#e8eaff',
                            color: '#6068bf',
                            fontWeight: 500,
                            border: '1px solid #6068bf30'
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.reference}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>₹{item.amount}</TableCell>
                      <TableCell>₹{item.gst || 0}</TableCell>
                      <TableCell>₹{item.commission || 0}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No Payments Found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setPage(page - 1);
                setDate(new Date().getTime());
              }}
              disabled={page <= 0}
              sx={{ 
                borderRadius: '8px',
                color: '#6068bf',
                borderColor: '#6068bf',
                '&:hover': {
                  backgroundColor: '#e8eaff',
                  borderColor: '#6068bf'
                },
                '&.Mui-disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setPage(page + 1);
                setDate(new Date().getTime());
              }}
              disabled={page >= Math.ceil(count / limit) - 1}
              sx={{ 
                borderRadius: '8px',
                color: '#6068bf',
                borderColor: '#6068bf',
                '&:hover': {
                  backgroundColor: '#e8eaff',
                  borderColor: '#6068bf'
                },
                '&.Mui-disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

// eslint-disable-next-line react/prop-types
function AddPayment({ setModal, getAPIData, users }) {
  let [data, setData] = useState({
    userid: users[0]?._id,
    mode: "Bank Transfer",
    reference: "",
    amount: "",
    gst: "",
    commission: "",
  });

  const CustomField = ({ field, form: { errors, touched }, ...props }) => {
    const hasError = errors[field.name] && touched[field.name];
    
    return (
      <TextField
        {...field}
        {...props}
        error={hasError}
        helperText={hasError ? errors[field.name] : ''}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&.Mui-focused fieldset': {
              borderColor: '#6068bf',
            },
          },
        }}
      />
    );
  };

  const CustomSelectField = ({ field, form: { errors, touched }, children, ...props }) => {
    const hasError = errors[field.name] && touched[field.name];
    
    return (
      <FormControl 
        fullWidth 
        error={hasError}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&.Mui-focused fieldset': {
              borderColor: '#6068bf',
            },
          },
        }}
      >
        <InputLabel>{props.label}</InputLabel>
        <Select
          {...field}
          {...props}
          label={props.label}
        >
          {children}
        </Select>
        {hasError && (
          <Typography variant="caption" color="error">
            {errors[field.name]}
          </Typography>
        )}
      </FormControl>
    );
  };

  return (
    <Dialog 
      open={true} 
      onClose={() => setModal(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
        }
      }}
    >
      <Box sx={{ bgcolor: '#6068bf', p: 2, color: 'white' }}>
        <DialogTitle sx={{ p: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className="fa fa-money"></i> Add Payment Details
        </DialogTitle>
      </Box>
      
      <DialogContent sx={{ p: 3, mt: 1 }}>
        <Formik
          initialValues={data}
          onSubmit={async (values, { setSubmitting }) => {
            addVendorPaymentAPI(values)
              .then((res) => {
                console.log(res);
                if (res.result !== "Done") {
                  alert("Unable to update payment");
                } else {
                  getAPIData();
                  setModal(false);
                }
              })
              .catch(() => {
                alert("Unable to update payment");
              });
          }}
          validationSchema={Yup.object().shape({
            userid: Yup.string().required("Vendor is required"),
            mode: Yup.string().required("Payment mode is required"),
            reference: Yup.string().required("Reference number is required"),
            amount: Yup.string().required("Amount is required"),
          })}
          enableReinitialize
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Field
                name="userid"
                label="Vendor"
                component={CustomSelectField}
              >
                <MenuItem value="">--Select--</MenuItem>
                {users?.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Field>

              <Field
                name="mode"
                label="Payment Mode"
                component={CustomSelectField}
              >
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="UPI Payment">UPI Payment</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
              </Field>

              <Field
                name="reference"
                label="Payment Reference"
                component={CustomField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-hashtag" style={{ color: '#6068bf' }}></i>
                    </InputAdornment>
                  ),
                }}
              />

              <Field
                name="amount"
                label="Amount"
                type="number"
                component={CustomField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-inr" style={{ color: '#6068bf' }}></i>
                    </InputAdornment>
                  ),
                }}
              />

              <Field
                name="gst"
                label="GST"
                type="number"
                component={CustomField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-percent" style={{ color: '#6068bf' }}></i>
                    </InputAdornment>
                  ),
                }}
              />

              <Field
                name="commission"
                label="Commission"
                type="number"
                component={CustomField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa fa-inr" style={{ color: '#6068bf' }}></i>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={<i className="fa fa-save"></i>}
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: '#6068bf',
                    '&:hover': {
                      backgroundColor: '#4c53a9',
                    }
                  }}
                >
                  Save Payment
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          variant="outlined"
          onClick={() => setModal(false)}
          sx={{ 
            borderRadius: '8px',
            borderColor: '#6c757d',
            color: '#6c757d',
            '&:hover': {
              borderColor: '#5a6268',
              backgroundColor: '#f8f9fa',
            }
          }}
          startIcon={<i className="fa fa-times"></i>}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
