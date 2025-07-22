import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Wrapper from "./Wrapper";

import { getSubcategory } from "../../Store/ActionCreators/SubcategoryActionCreators";
import { useDispatch, useSelector } from "react-redux";

export default function VendorSubcategory() {
  var dispatch = useDispatch();
  var allSubcategories = useSelector((state) => state.SubcategoryStateData);
  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 130 },
  ];
  var rows = [];
  if (allSubcategories.length) {
    for (let item of allSubcategories) rows.push(item);
  }
  function getAPIData() {
    dispatch(getSubcategory());
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allSubcategories.length]);
  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <div className="row">
            <h3 className="flex-1">Sub Categories</h3>
            {/* <div className="col-md-3 text-right">
              <Link to="/vendor-add-subcategory" className="add__item">
                <span className="fa fa-plus mr-2"></span> Add Sub Category
              </Link>
            </div> */}
          </div>
        </div>
        <div className="row">
          {rows.map((item) => <div className="col-md-2" key={item._id}>
            <div className="cat__item">{item.name}</div>
          </div>)}
        </div>
        {/* <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div> */}
      </div>
    </Wrapper>
  );
}
