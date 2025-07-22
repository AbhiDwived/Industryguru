import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Wrapper from "./Wrapper";

import { getBrand } from "../../Store/ActionCreators/BrandActionCreators";
import { useDispatch, useSelector } from "react-redux";
import VendorSideNavbar from "./VendorSideNavbar";

export default function VendorBrand() {
  var dispatch = useDispatch();
  var allbrands = useSelector((state) => state.BrandStateData);
  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 130 },
  ];
  var rows = [];
  if (allbrands.length) {
    for (let item of allbrands) rows.push(item);
  }
  function getAPIData() {
    dispatch(getBrand());
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allbrands.length]);
  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <div className="row">
            <h3 className="flex-1">Brands</h3>
            {/* <div className="col-md-3 text-right">
              <Link to="/vendor-add-brand" className="add__item">
                <span className="fa fa-plus mr-2"></span> Add Brands
              </Link>
            </div> */}
          </div>
        </div>
        <div className="row">
          {rows.map((item) => (
            <div className="col-md-2" key={item._id}>
              <div className="cat__item">{item.name}</div>
            </div>
          ))}
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
