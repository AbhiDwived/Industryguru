import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(...registerables);

const OrderReport = ({ orderReport }) => {
  // Default data structure in case `orderReport` is not provided or invalid
  const defaultData = [0, 0, 0, 0, 0, 0];

  // Validate `orderReport` prop and use default data if invalid
  const validatedOrderReport = Array.isArray(orderReport) ? orderReport : defaultData;

  // Chart.js data configuration
  const data = {
    labels: [
      "Order Placed",
      "Packed",
      "Ready to Ship",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ],
    datasets: [
      {
        borderWidth: 1,
        data: validatedOrderReport,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 206, 86, 0.5)", // Yellow
          "rgba(75, 192, 192, 0.5)", // Green
          "rgba(153, 102, 255, 0.5)", // Purple
          "rgba(255, 159, 64, 0.5)", // Orange
        ],
      },
    ],
  };

  // Chart.js options configuration
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Position the legend at the bottom
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default OrderReport;