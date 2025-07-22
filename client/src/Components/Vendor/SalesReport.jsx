import React from "react";
import Wrapper from "./Wrapper";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register necessary chart elements and plugin
ChartJS.register(...registerables, ChartDataLabels);

const SalesReport = ({ salesReport }) => {
  const defaultData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Fallback to default data if no valid salesReport is passed
  const validatedSalesReport = salesReport && salesReport.datasets ? salesReport : defaultData;

  const options = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`, // Formatting with ₹
        color: "white",
        font: {
          weight: "bold",
          size: 14,
          family: "Poppins, sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: true },
        ticks: {
          callback: (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`, // Formatting with ₹
        },
      },
    },
  };

  return (
    <Wrapper>
      <div className="chart-container" style={{ height: "400px" }}>
        <Bar data={validatedSalesReport} options={options} />
      </div>
    </Wrapper>
  );
};

export default SalesReport;
