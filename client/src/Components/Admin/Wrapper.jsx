import React from "react";
import SideNavbar from "./SideNavbar";

export default function Wrapper({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-2 col-lg-3 sidebar">
          <SideNavbar />
        </div>
        <div className="col-xl-10 col-lg-9">
          {children}
        </div>
      </div>
    </div>
  );
}
