import React from 'react';
import useToast from '../hooks/useToast';
import { commonToasts } from '../utils/toastUtils';

const ToastDemo = () => {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.success('This is a success message!', 'Success');
  };

  const showErrorToast = () => {
    toast.error('This is an error message!', 'Error');
  };

  const showWarningToast = () => {
    toast.warning('This is a warning message!', 'Warning');
  };

  const showInfoToast = () => {
    toast.info('This is an info message!', 'Information');
  };

  const showCommonToasts = () => {
    commonToasts.itemCreated('Product');
    setTimeout(() => commonToasts.itemAddedToCart('iPhone 15'), 1000);
    setTimeout(() => commonToasts.paymentSuccess(), 2000);
  };

  const showMultipleToasts = () => {
    toast.success('First success message');
    setTimeout(() => toast.warning('Second warning message'), 500);
    setTimeout(() => toast.error('Third error message'), 1000);
    setTimeout(() => toast.info('Fourth info message'), 1500);
  };

  const showLongDurationToast = () => {
    toast.success('This toast will stay for 10 seconds', 'Long Duration', { duration: 10000 });
  };

  const clearAllToasts = () => {
    toast.clear();
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Toast Notification Demo</h4>
              <p className="mb-0">Test different types of toast notifications</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Basic Toast Types */}
                <div className="col-md-6">
                  <h5>Basic Toast Types</h5>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-success" 
                      onClick={showSuccessToast}
                    >
                      Show Success Toast (Green)
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={showErrorToast}
                    >
                      Show Error Toast (Red)
                    </button>
                    <button 
                      className="btn btn-warning" 
                      onClick={showWarningToast}
                    >
                      Show Warning Toast (Yellow)
                    </button>
                    <button 
                      className="btn btn-info" 
                      onClick={showInfoToast}
                    >
                      Show Info Toast (Blue)
                    </button>
                  </div>
                </div>

                {/* Advanced Features */}
                <div className="col-md-6">
                  <h5>Advanced Features</h5>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary" 
                      onClick={showCommonToasts}
                    >
                      Show Common Toasts (Sequence)
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={showMultipleToasts}
                    >
                      Show Multiple Toasts
                    </button>
                    <button 
                      className="btn btn-dark" 
                      onClick={showLongDurationToast}
                    >
                      Long Duration Toast (10s)
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={clearAllToasts}
                    >
                      Clear All Toasts
                    </button>
                  </div>
                </div>
              </div>

              {/* Usage Examples */}
              <div className="mt-4">
                <h5>Usage Examples</h5>
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <h6>In React Components:</h6>
                      <pre className="mb-1">{`import useToast from '../hooks/useToast';
const toast = useToast();
toast.success('Item created successfully!');`}</pre>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="alert alert-warning">
                      <h6>In Services/API calls:</h6>
                      <pre className="mb-1">{`import { commonToasts } from '../utils/toastUtils';
commonToasts.loginSuccess();
commonToasts.networkError();`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Guide */}
              <div className="mt-4">
                <h5>Color Guide</h5>
                <div className="row">
                  <div className="col-sm-6 col-lg-3 mb-2">
                    <div className="alert alert-success mb-0">
                      <strong>Green (Success):</strong> Create, Update, Login, Payment success
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3 mb-2">
                    <div className="alert alert-danger mb-0">
                      <strong>Red (Error):</strong> Login failed, Network errors, Validation errors
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3 mb-2">
                    <div className="alert alert-warning mb-0">
                      <strong>Yellow (Warning):</strong> Low stock, Unsaved changes, Session expiring
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3 mb-2">
                    <div className="alert alert-info mb-0">
                      <strong>Blue (Info):</strong> Added to cart, Processing, General information
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;