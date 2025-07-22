import React from "react";
import Wrapper from "./Wrapper";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(...registerables, ChartDataLabels);

const EarningReports = () => {
  const earningData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Earnings",
        data: [5000, 10000, 7500, 12000, 9000],
        fill: false,
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`, // <-- Change to ₹
        color: "black",
        font: {
          weight: "bold",
          size: 12,
          family: "Poppins, sans-serif",
        },
        align: "top",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: true },
        ticks: {
          callback: (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`, // <-- Change to ₹
        },
      },
    },
  };

  return (
    <Wrapper>
    <div className="container" style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>💰 Earning Report</h2>
      <div style={{ height: "400px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <Line data={earningData} options={options} />
      </div>
    </div>
    </Wrapper>
  );
};

export default EarningReports;
