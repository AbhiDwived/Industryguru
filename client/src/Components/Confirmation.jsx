import React, { useEffect, useState } from "react";

export default function Confirmation() {
  const [orderID, setOrderID] = useState("");

  useEffect(() => {
    // Retrieve orderID from local storage
    const storedOrderID = localStorage.getItem("orderID");
    setOrderID(storedOrderID || "");
  }, []);

  return (
    <div className="container-fluid my-3 text-center">
      <h2>Your Order ID: {orderID}</h2>
      <h2 className="text-success">Thank You!!!</h2>

      <h3>Your Order Has Been Placed!!!</h3>
      <h4>Now You Can Track Your Order in Profile Section</h4>
    </div>
  );
}
