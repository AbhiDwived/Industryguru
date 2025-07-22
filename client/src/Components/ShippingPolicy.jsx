import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="page_section">
      <div className="container">
        <h4 className="text-center mb-4">Shipping Policy</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Shipping Charges</h5>
              <p>
                Shipping charges vary depending on the destination and the
                weight of the package. Please refer to the checkout page for
                accurate shipping charges.
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Delivery Time</h5>
              <p>
                Delivery time may vary based on the destination and availability
                of the product. Typically, orders are delivered within 3-5
                business days.
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Tracking</h5>
              <p>
                Once your order has been dispatched, you will receive a tracking
                number via email. You can use this tracking number to track the
                status of your shipment.
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Packaging</h5>
              <p>
                All items are carefully packaged to ensure safe delivery.
                Fragile items are wrapped with extra padding to prevent damage
                during transit.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Return Policy</h5>
              <p>
                We offer a hassle-free return policy. If you are not satisfied
                with your purchase, you can return the item within 30 days for a
                full refund.
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Contact Us</h5>
              <p>
                If you have any questions or concerns regarding shipping, please
                feel free to contact us at{" "}
                <a href="mailto:support@example.com" className="text-info">
                  industryguruinfo@gmail.com
                </a>{" "}
                or call us at{" "}
                <a href="tel:+18001234567" className="text-info">
                  9810092418
                </a>
                .
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Order Processing Time</h5>
              <p>
                Orders are typically processed within 1-2 business days. Please
                allow additional time during peak seasons or holidays.
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Customer Service</h5>
              <p>
                Our customer service team is available to assist you with any
                queries or concerns you may have. We strive to provide the best
                shopping experience for our customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
