import Store from '../Store/Store';
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast 
} from '../Store/Slices/toastSlice';

// Toast utility functions that can be used from anywhere
export const toastUtils = {
  success: (message, title = 'Success', options = {}) => {
    Store.dispatch(showSuccessToast(message, title, options));
  },
  
  error: (message, title = 'Error', options = {}) => {
    Store.dispatch(showErrorToast(message, title, options));
  },
  
  warning: (message, title = 'Warning', options = {}) => {
    Store.dispatch(showWarningToast(message, title, options));
  },
  
  info: (message, title = 'Info', options = {}) => {
    Store.dispatch(showInfoToast(message, title, options));
  }
};

// Common toast messages for frequent use cases
export const commonToasts = {
  // Success messages
  itemCreated: (itemName) => toastUtils.success(`${itemName} created successfully!`),
  itemUpdated: (itemName) => toastUtils.success(`${itemName} updated successfully!`),
  itemDeleted: (itemName) => toastUtils.success(`${itemName} deleted successfully!`),
  loginSuccess: () => toastUtils.success('Welcome back! You have been logged in successfully.', 'Login Successful'),
  logoutSuccess: () => toastUtils.success('You have been logged out successfully.', 'Logout Successful'),
  orderPlaced: () => toastUtils.success('Your order has been placed successfully!', 'Order Confirmed'),
  paymentSuccess: () => toastUtils.success('Payment processed successfully!', 'Payment Successful'),
  profileUpdated: () => toastUtils.success('Your profile has been updated successfully!'),
  
  // Error messages  
  loginError: () => toastUtils.error('Invalid credentials. Please check your email and password.', 'Login Failed'),
  networkError: () => toastUtils.error('Network error. Please check your internet connection and try again.', 'Connection Error'),
  serverError: () => toastUtils.error('Something went wrong on our end. Please try again later.', 'Server Error'),
  validationError: (message) => toastUtils.error(message, 'Validation Error'),
  itemNotFound: (itemName) => toastUtils.error(`${itemName} not found.`, 'Not Found'),
  unauthorized: () => toastUtils.error('You are not authorized to perform this action.', 'Unauthorized'),
  paymentError: () => toastUtils.error('Payment failed. Please try again or use a different payment method.', 'Payment Failed'),
  
  // Warning messages
  unsavedChanges: () => toastUtils.warning('You have unsaved changes. Please save before leaving.', 'Unsaved Changes'),
  itemLowStock: (itemName) => toastUtils.warning(`${itemName} is running low on stock.`, 'Low Stock'),
  sessionExpiring: () => toastUtils.warning('Your session will expire soon. Please save your work.', 'Session Expiring'),
  formValidation: (message) => toastUtils.warning(message, 'Please check your input'),
  
  // Info messages
  itemAddedToCart: (itemName) => toastUtils.info(`${itemName} added to cart.`, 'Added to Cart'),
  itemRemovedFromCart: (itemName) => toastUtils.info(`${itemName} removed from cart.`, 'Removed from Cart'),
  itemAddedToWishlist: (itemName) => toastUtils.info(`${itemName} added to wishlist.`, 'Added to Wishlist'),
  processing: () => toastUtils.info('Processing your request...', 'Please Wait'),
  emailSent: () => toastUtils.info('Email sent successfully!', 'Email Sent'),
};

// Helper function to handle API responses
export const handleApiResponse = (response, successMessage, errorMessage) => {
  if (response.status >= 200 && response.status < 300) {
    if (successMessage) {
      toastUtils.success(successMessage);
    }
  } else {
    const message = errorMessage || response.data?.message || 'Something went wrong';
    toastUtils.error(message);
  }
};

// Helper function to handle form submissions
export const handleFormSubmission = async (submitFunction, successMessage, errorMessage) => {
  try {
    await submitFunction();
    if (successMessage) {
      toastUtils.success(successMessage);
    }
  } catch (error) {
    const message = errorMessage || error.response?.data?.message || error.message || 'Something went wrong';
    toastUtils.error(message);
  }
};

export default toastUtils;