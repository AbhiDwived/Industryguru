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
    <div className="sidebar-container" onMouseLeave={handleMouseLeave}>
      <div
        id="sidebar"
        className="list-group"
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="list-group-item"
          style={{
            background: "#6068bf",
            color: "white",
            padding: "12px 16px",
            fontWeight: "600",
            fontSize: "14px",
            border: "none"
          }}
        >
          <i className="fa fa-th-large me-2"></i>
          All Categories
        </div>
        <div className="categories-list" style={{ height: "400px", overflow: "auto" }}>
          {allMaincategory.map((item) => (
            <Link
              key={item._id}
              to={`/shop/${item._id}/All/All`}
              onMouseEnter={(e) => handleMainCatEnter(item, e)}
              className="list-group-item list-group-item-action"
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                border: "none",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <span>{item.name}</span>
              <i className="fa fa-chevron-right" style={{ fontSize: "12px", color: "#999" }}></i>
            </Link>
          ))}
        </div>
      </div>

      {/* Subcategory Panel */}
      {hoveredMainCat && sidebarPos && (
        <div
          className="subcategory-panel"
          style={{
            height: "400px",
            width: "280px",
            position: "fixed",
            top: `${sidebarPos.top}px`,
            left: `${sidebarPos.left}px`,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "0",
            overflowY: "auto",
            zIndex: 3
          }}
          onMouseEnter={() => setHoveredMainCat(hoveredMainCat)}
        >
          <div style={{
            padding: "12px 16px",
            background: "#6068bf",
            color: "white",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            {hoveredMainCat.name}
          </div>
          <div>
            {allSubcategory
              .filter((sub) => sub.maincategory === hoveredMainCat._id)
              .map((sub) => (
                <Link
                  key={sub._id}
                  to={`/shop/${hoveredMainCat._id}/${sub._id}/All`}
                  onMouseEnter={(e) => handleSubCatEnter(sub, e)}
                  className="list-group-item list-group-item-action"
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    border: "none",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >
                  <span>{sub.name}</span>
                  <i className="fa fa-chevron-right" style={{ fontSize: "10px", color: "#999" }}></i>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Brand Panel */}
      {hoveredSubCat && subcatPanelPos && (
        <div
          className="brand-panel"
          style={{
            position: "fixed",
            top: `${subcatPanelPos.top}px`,
            left: `${subcatPanelPos.left}px`,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "0",
            zIndex: 4,
            width: "250px",
            maxHeight: "400px",
            overflowY: "auto"
          }}
          onMouseEnter={() => setHoveredSubCat(hoveredSubCat)}
        >
          <div style={{
            padding: "12px 16px",
            background: "#6068bf",
            color: "white",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            {hoveredSubCat.name} Brands
          </div>
          <div>
            {allBrand
              .filter((brand) => brand.subcategory === hoveredSubCat._id)
              .map((brand) => (
                <Link
                  key={brand._id}
                  to={`/shop/${hoveredMainCat._id}/${hoveredSubCat._id}/${brand._id}`}
                  className="list-group-item list-group-item-action"
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    textDecoration: "none",
                    color: "#333",
                    border: "none",
                    borderBottom: "1px solid #f0f0f0"
                  }}
                >
                  {brand.name}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSidebar;
