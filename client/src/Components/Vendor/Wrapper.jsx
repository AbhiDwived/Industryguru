import React from "react";
import VendorSideNavbar from "./VendorSideNavbar";

export default function Wrapper({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <VendorSideNavbar />
        </div>
        <div className="col-md-9 col-lg-10 py-4">
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
