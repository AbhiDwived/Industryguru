import React, { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import formValidation from "../CustomValidation/formValidation";
import {
  updateSubcategory,
  getSubcategory,
} from "../../Store/ActionCreators/SubcategoryActionCreators";
import { getMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators";

export default function UpdateSubcategory() {
  const [selectedOption, setSelectedOption] = useState("");
  let [name, setName] = useState("");

  let [message, setMessage] = useState("");
  let [show, setShow] = useState(false);
  var allMaincategories = useSelector((state) => state.MaincategoryStateData);

  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { _id } = useParams();
  let allSubcategories = useSelector((state) => state.SubcategoryStateData);

  const subCategoryData = allSubcategories.find((subCat) => subCat._id === _id);

  const mainCategoryData = allMaincategories.find(
    (mainCat) => mainCat._id === subCategoryData?.maincategory
  );

  function getInputData(e) {
    setMessage(formValidation(e));
    setName(e.target.value);
  }
  async function postData(e) {
    e.preventDefault();
    if (message.length === 0) {
      let item =
        allMaincategories.length &&
        allMaincategories.find((x) => x.name === name);
      allSubcategories.length && allSubcategories.find((x) => x.name === name);
      if (item) {
        setShow(true);
        setMessage("Subcategory Name Already Exist");
      } else {
        dispatch(
          updateSubcategory({
            _id: _id,
            name: name,
            maincategory: selectedOption,
          })
        );
        navigate("/admin-subcategories");
      }
    } else setShow(true);
  }
  function getAPIData() {
    dispatch(getSubcategory());
    if (allSubcategories.length) {
      let item = allSubcategories.find((x) => x._id === _id);
      if (item) setName(item.name);
    }
    dispatch(getMaincategory());
    // if (allMaincategories.length) {
    //   let item = allMaincategories.find((x) => x._id === _id);
    //   if (item) setName(item.name);
    // }
  }
  useEffect(() => {
    getAPIData();

    // eslint-disable-next-line
  }, [allSubcategories.length]);
  useEffect(() => {
    setSelectedOption(mainCategoryData?._id);
  }, [mainCategoryData]);

  return (
    <div className="page_section">
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <SideNavbar />
          </div>
          <div className="col-md-9">
            <h5 className="header-color text-light p-2 text-center">
              Subcategory
            </h5>
            <form onSubmit={postData}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label> Select Main Category</label>
                    <select
                      name="maincategory"
                      onChange={(e) => setSelectedOption(e.target.value)}
                      value={selectedOption}
                      className="form-control"
                    >
                      <option>Select an option</option>
                      {allMaincategories.map((category, i) => (
                        <option
                          key={i}
                          value={category._id}
                          selected={category._id === selectedOption}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
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
                    {show ? (
                      <p className="text-danger text-capitalize">{message}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
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
