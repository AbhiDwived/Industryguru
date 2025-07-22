import React from "react";

const ReturnRefundPolicy = () => {
  return (
    <div className="page_section">
      <div className="container">
        <h4 className="text-center mb-4">Return and Refund Policy</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Return Process</h5>
              <p>
                To return an item, please follow these steps:
                <ol>
                  <li>
                    Ensure the item is in its original condition and packaging.
                  </li>
                  <li>
                    Contact our customer service team to initiate the return
                    process.
                  </li>
                  <li>Package the item securely and ship it back to us.</li>
                  <li>
                    Once we receive the returned item, we will process your
                    refund.
                  </li>
                </ol>
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Refund Policy</h5>
              <p>
                We offer refunds on returned items within 30 days of purchase.
                Refunds are issued to the original payment method used during
                checkout.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Exchange Policy</h5>
              <p>
                If you wish to exchange an item for a different size or color,
                please contact our customer service team. Exchanges are subject
                to product availability.
              </p>
            </div>
            <div className="policy-section p-4 mb-4 bg-light rounded">
              <h5>Contact Us</h5>
              <p>
                If you have any questions or concerns regarding our return and
                refund policy, please feel free to contact us at{" "}
                <a href="mailto:support@example.com" className="text-info">
                  industryguruinfo@gmail.com
                </a>
                or call us at{" "}
                <a href="tel:+18001234567" className="text-info">
                  9810092418
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;
