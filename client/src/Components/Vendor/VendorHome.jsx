import React, { useState, useEffect } from "react";
import { apiLink } from "../../utils/utils";
import Wrapper from "./Wrapper";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "react-circular-progressbar/dist/styles.css";

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const VendorHome = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrder: 0,
    totalEarning: 0,
    totalPending: 0,
    orderReport: [],
    salesReport: { labels: [], datasets: [] },
    earningReport: { labels: [], datasets: [] },
  });
  const [search, setSearch] = useState("7days");

  // Fetching data from the API
  async function getAPIData() {
    const response = await fetch(`${apiLink}/api/vendor-dashboard?search=${search}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    const result = await response.json();
    if (result.result === "Done") {
      setData((prev) => ({ ...prev, ...result }));
    }
  }

  useEffect(() => {
    getAPIData();
  }, [search]);

  return (
    <Wrapper>
      {/* Filter Dropdown */}
      <div className="row">
        <div className="col-md-4">
          <div className="ui__form position-relative">
            <label htmlFor="search" className="ui__form__label">
              Filter
            </label>
            <select
              id="search"
              name="search"
              className="ui__form__field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            >
              <option value={"7days"}>Last 7 Days</option>
              <option value={"month"}>Current Month</option>
              <option value={"lastmonth"}>Last Month</option>
              <option value={"last3month"}>Last 3 Months</option>
              <option value={"last6month"}>Last 6 Months</option>
              <option value={"last12month"}>Last 12 Months</option>
              <option value={"year"}>This Year</option>
              <option value={"lastyear"}>Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="row mb-4">
        {/* Total Earnings */}
        <div className="col-md-3">
          <div className="box__home">
            <h5>Total Earning</h5>
            <p>₹{data.totalEarning}</p>
            <div className="box__icon">
              <i className="fa fa-wallet"></i>
            </div>
          </div>
        </div>

        {/* Daily Orders */}
        <div className="col-md-3">
          <div className="box__home">
            <h5>Daily Orders</h5>
            <p>{data.totalOrder}</p>
            <div className="box__icon">
              <i className="fa fa-shopping-basket"></i>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="col-md-3">
          <div className="box__home">
            <h5>Total Products</h5>
            <p>{data.totalProducts}</p>
            <div className="box__icon">
              <i className="fa fa-shopping-cart"></i>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="col-md-3">
          <div className="box__home">
            <h5>Pending Orders</h5>
            <p>{data.totalPending}</p>
            <div className="box__icon">
              <i className="fa fa-shopping-basket"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="row">
        {/* Sales Report - Line Chart */}
        <div className="col-md-8 mb-4">
          <div className="box__layout">
            <div className="header__layout">
              <h3>Sales Report</h3>
            </div>
            <div style={{ height: 220 }}>
              <Line
                data={{
                  labels: data.salesReport.labels,
                  datasets: [
                    {
                      label: "Sales Over Time",
                      data: data.salesReport.datasets,
                      borderColor: "#4BC0C0",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `₹${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Order Report - Pie Chart */}
        <div className="col-md-4 mb-4">
          <div className="box__layout">
            <div className="header__layout">
              <h3>Order Report</h3>
            </div>
            <div style={{ height: 220 }}>
              <Pie
                data={{
                  labels: data.orderReport.map((item) => item.name),
                  datasets: [
                    {
                      data: data.orderReport.map((item) => item.count),
                      backgroundColor: ["#FF5733", "#FFC300", "#33FF57", "#FF33A6"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.raw} Orders`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Earning Report - Bar Chart */}
        <div className="col-md-12 mb-4">
          <div className="box__layout">
            <div className="header__layout">
              <h3>Earning Report</h3>
            </div>
            <div style={{ height: 220 }}>
              <Bar
                data={{
                  labels: data.earningReport.labels,
                  datasets: [
                    {
                      label: "Earnings",
                      data: data.earningReport.datasets,
                      backgroundColor: "#FF5733",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `₹${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default VendorHome;
