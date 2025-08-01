import React, { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import formValidation from "../CustomValidation/formValidation";
import {updateMaincategory,getMaincategory} from "../../Store/ActionCreators/MaincategoryActionCreators"

export default function UpdateMaincategory() {
  let [name,setName] = useState("");
  
  let [message, setMessage] = useState("");
  let [show , setShow] = useState(false)

  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { _id } = useParams()
  let allMaincategories = useSelector((state)=> state.MaincategoryStateData)
  function getInputData(e) {
      setMessage(formValidation(e))
      setName( e.target.value)
  }
  async function postData(e) {
    e.preventDefault();
    if(message.length === 0 ){
      let item = allMaincategories.length && allMaincategories.find((x) => x.name === name.current);
      if (item){
          setShow(true)
          setMessage("Maincategory Name Already Exist")
      }
    else {
        dispatch(updateMaincategory({ _id:_id, name: name }));
        navigate("/admin-maincategories");
    }
  }
  else
   setShow (true)
  }
  function getAPIData(){
     dispatch(getMaincategory())
     if(allMaincategories.length){
         let item = allMaincategories.find((x)=>x._id=== _id)
         if(item)
         setName(item.name)
     }
  }
  useEffect(()=>{
    getAPIData();
    // eslint-disable-next-line
  },[allMaincategories.length])
  return (
    <div className="page_section">
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <SideNavbar />
          </div>
          <div className="col-md-9">
            <h5 className="header-color text-light p-2 text-center">
              Maincategory
            </h5>
            <form onSubmit={postData}>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={getInputData}
                  className="form-control"
                  placeholder="Name"
                />
                {
                 show? <p className="text-danger text-capitalize">{message}</p>:""
               }
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-success w-50"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button type="submit" className="btn main-color w-50">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
