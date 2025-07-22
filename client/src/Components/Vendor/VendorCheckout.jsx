import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wrapper from "./Wrapper";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

import { getVendorOrdersAPI } from "../../Store/Services/ProductService";

export default function VendorCheckout() {
  const [allCheckouts, setAllCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "Order ID", width: 220 },
    { field: "userid", headerName: "User ID", width: 220, renderCell: ({ row }) => row.userid?._id || "No User ID" },
    
    { 
      field: "productnames", 
      headerName: "Products", 
      width: 250,
      renderCell: ({ row }) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row.productnames?.join(", ")}
        </div>
      )
    },
    { field: "orderstatus", headerName: "Order Status", width: 150 },
    { field: "paymentmode", headerName: "Payment Mode", width: 150 },
    { field: "paymentstatus", headerName: "Payment Status", width: 150 },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      renderCell: ({ row }) => <p>&#8377;{row.total}</p>,
    },
    { field: "date", headerName: "Date", width: 200 },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      width: 100,
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            navigate(`/vendor-single-checkouts/${row._id}`);
          }}
        >
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
  ];

  async function fetchVendorOrders() {
    try {
      setLoading(true);
      const id = localStorage.getItem("userid");

      const res = await getVendorOrdersAPI(0, "", "", "");

      const items = (res?.checkouts || []).map((item) => {
        const vendorProducts = item.products.filter((p) => p.addedBy === id);

        if (vendorProducts.length === 0) return null; // skip if no vendor products

        const total = vendorProducts.reduce((a, b) => a + b.total, 0);
        const productnames = vendorProducts.map((p) => p.name);

        return {
          _id: item._id,
          userid: item.userid || "No User ID",  // ✅ fallback if userid missing
          orderstatus: item.orderstatus,
          paymentmode: item.paymentmode,
          paymentstatus: item.paymentstatus,
          total: total,
          date: item.date,
          productnames: productnames,
        };
      }).filter(item => item !== null);

      setAllCheckouts(items);
    } catch (error) {
      console.error("Error fetching vendor orders", error);
      alert("Failed to load vendor orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <h3 className="flex-1">Vendor Checkouts</h3>
        </div>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={allCheckouts}
            columns={columns}
            pageSize={10}
            loading={loading}
            rowsPerPageOptions={[10]}
          />
        </div>
      </div>
    </Wrapper>
  );
}
