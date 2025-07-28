import React, { useEffect, useRef, useState } from "react";
import SideNavbar from "./SideNavbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Paper, TextField, Button, Alert } from "@mui/material";

import formValidation from "../CustomValidation/formValidation";
import {
  addMaincategory,
  getMaincategory,
} from "../../Store/ActionCreators/MaincategoryActionCreators";
import { showToast } from "../../utils/toast";

export default function AddMaincategory() {
  let name = useRef("");

  let [message, setMessage] = useState("Maincategory Name must Required");
  let [show, setShow] = useState(false);

  let navigate = useNavigate();
  let dispatch = useDispatch();
  let allMaincategories = useSelector((state) => state.MaincategoryStateData);
  
  function getInputData(e) {
    setMessage(formValidation(e));
    name.current = e.target.value;
  }
  
  async function postData(e) {
    e.preventDefault();
    if (message.length === 0) {
      let item =
        allMaincategories.length &&
        allMaincategories.find((x) => x.name === name.current);
      if (item) {
        setShow(true);
        setMessage("Maincategory Name Already Exist");
        showToast.error("Maincategory Name Already Exist");
      } else {
        dispatch(addMaincategory({ name: name.current }));
        showToast.success("Main category added successfully!");
        navigate("/admin-maincategories");
      }
    } else {
      setShow(true);
      showToast.error(message);
    }
  }
  
  function getAPIData() {
    dispatch(getMaincategory());
  }
  
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allMaincategories.length]);
  
  return (
    <div className="page_section">
      <div className="container-fluid my-3">
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
                <i className="fa fa-plus-circle" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Add New Category
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <form onSubmit={postData}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                      Category Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="name"
                      onChange={getInputData}
                      placeholder="Enter category name"
                      variant="outlined"
                      size="medium"
                      error={show}
                      helperText={show ? message : ""}
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
                          <i className="fa fa-list-alt me-2" style={{ color: '#6068bf' }}></i>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 4
                  }}>
                    <Button
                      variant="outlined"
                      onClick={() => window.history.back()}
                      sx={{ 
                        flex: 1,
                        py: 1.2,
                        borderRadius: '8px',
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        '&:hover': {
                          borderColor: '#5a6268',
                          backgroundColor: '#f8f9fa',
                        }
                      }}
                      startIcon={<i className="fa fa-arrow-left"></i>}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ 
                        flex: 1,
                        py: 1.2,
                        borderRadius: '8px',
                        backgroundColor: '#6068bf',
                        '&:hover': {
                          backgroundColor: '#4c53a9',
                        }
                      }}
                      startIcon={<i className="fa fa-save"></i>}
                    >
                      Create
                    </Button>
                  </Box>
                </form>
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}
