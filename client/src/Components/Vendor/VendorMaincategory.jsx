import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Wrapper from "./Wrapper";

import { getMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators";
import { useDispatch, useSelector } from "react-redux";

export default function VendorMaincategory() {
  var dispatch = useDispatch();
  var allmaincategories = useSelector((state) => state.MaincategoryStateData);
  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 130 },
  ];
  var rows = [];
  if (allmaincategories.length) {
    for (let item of allmaincategories) rows.push(item);
  }
  function getAPIData() {
    dispatch(getMaincategory());
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allmaincategories.length]);
  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <div className="row">
            <h3 className="flex-1">Main Categories</h3>
            {/* <div className="col-md-3 text-right">
              <Link to="/vendor-add-maincategory" className="add__item">
                <span className="fa fa-plus mr-2"></span> Add Category
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
