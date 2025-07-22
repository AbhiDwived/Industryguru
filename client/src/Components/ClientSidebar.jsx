import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMaincategory } from "../Store/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../Store/ActionCreators/BrandActionCreators";

const ClientSidebar = () => {
  const dispatch = useDispatch();
  const allMaincategory = useSelector((state) => state.MaincategoryStateData);
  const allSubcategory = useSelector((state) => state.SubcategoryStateData);
  const allBrand = useSelector((state) => state.BrandStateData);

  const [hoveredMainCat, setHoveredMainCat] = useState(null);
  const [hoveredSubCat, setHoveredSubCat] = useState(null);
  const [sidebarPos, setSidebarPos] = useState(null);
  const [subcatPanelPos, setSubcatPanelPos] = useState(null);

  useEffect(() => {
    dispatch(getMaincategory());
  }, [dispatch]);

  const handleMainCatEnter = (item, event) => {
    const sidebar = document.getElementById("sidebar");
    const rect = sidebar.getBoundingClientRect();
    setSidebarPos({ top: rect.top, left: rect.right });
    setHoveredMainCat(item);
    setHoveredSubCat(null);
    dispatch(getSubcategory(item._id));
  };

  const handleSubCatEnter = (item, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSubcatPanelPos({ top: rect.top, left: rect.right });
    setHoveredSubCat(item);
    dispatch(getBrand(item._id));
  };

  const handleMouseLeave = () => {
    setHoveredMainCat(null);
    setHoveredSubCat(null);
  };

  return (
    <div className="list-group" onMouseLeave={handleMouseLeave}>
      <div
        id="sidebar"
        className="list-group"
        style={{
          overflow: "auto",
          borderRight: "1px solid #ddd",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{ background: "#6068bf", color: "white" }}
          className="list-group-item list-group-item-action active"
        >
          All Categories
        </div>
        <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
          {allMaincategory.map((item) => (
            <div
              key={item._id}
              onMouseEnter={(e) => handleMainCatEnter(item, e)}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* Subcategory Panel */}
      {hoveredMainCat && sidebarPos && (
        <div
          style={{
            height: "27rem",
            position: "fixed",
            top: `${sidebarPos.top}px`,
            left: `${sidebarPos.left}px`,
            background: "#f8f9fa",
            border: "1px solid #ddd",
            padding: "1rem",
            overflowY: "auto",
            zIndex: 3,
          }}
        >
          <h5 style={{ color: "#6068bf" }}>{hoveredMainCat.name} Subcategories</h5>
          <hr />
          {allSubcategory
            .filter((sub) => sub.maincategory === hoveredMainCat._id)
            .map((sub) => (
              <div
                key={sub._id}
                onMouseEnter={(e) => handleSubCatEnter(sub, e)}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                {sub.name}
              </div>
            ))}
        </div>
      )}

      {/* Brand Panel */}
      {hoveredSubCat && subcatPanelPos && (
        <div
          style={{
            position: "fixed",
            top: `${subcatPanelPos.top}px`,
            left: `${subcatPanelPos.left}px`,
            background: "#fff",
            border: "1px solid #ddd",
            padding: "1rem",
            zIndex: 4,
            width: "220px",
            maxHeight: "27rem",
            overflowY: "auto",
          }}
        >
          <h6 style={{ color: "#6068bf" }}>{hoveredSubCat.name} Brands</h6>
          <hr />
          {allBrand
            .filter((brand) => brand.subcategory === hoveredSubCat._id)
            .map((brand) => (
              <div key={brand._id} className="list-group-item">
                {brand.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ClientSidebar;
