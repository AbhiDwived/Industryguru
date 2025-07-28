# Toast Notification System

A comprehensive toast notification system for the StudentMall application with support for different types of notifications (success, error, warning, info) with color-coded styling.

## Features

- ✅ **Green (Success)**: For successful operations like login, create, update, payment success
- ❌ **Red (Error)**: For errors like login failures, network errors, validation errors  
- ⚠️ **Yellow (Warning)**: For warnings like low stock, unsaved changes, session expiring
- ℹ️ **Blue (Info)**: For information like items added to cart, processing status

## Installation & Setup

The toast system is already integrated into the application. The main components are:

- `ToastContainer.jsx` - Displays the toast notifications
- `toastSlice.js` - Redux slice for state management
- `useToast.js` - Custom hook for easy usage
- `toastUtils.js` - Utility functions and common toasts
- `Toast.css` - Styling for the toasts

## Usage

### 1. Using the Hook in React Components

```jsx
import useToast from '../hooks/useToast';

const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!', 'Success');
  };

  const handleError = () => {
    toast.error('Something went wrong!', 'Error');
  };

  const handleWarning = () => {
    toast.warning('Please check your input!', 'Warning');
  };

  const handleInfo = () => {
    toast.info('Processing your request...', 'Info');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
      <button onClick={handleWarning}>Warning Toast</button>
      <button onClick={handleInfo}>Info Toast</button>
    </div>
  );
};
```

### 2. Using Utility Functions (from anywhere)

```javascript
import { toastUtils, commonToasts } from '../utils/toastUtils';

// Basic usage
toastUtils.success('Item created successfully!');
toastUtils.error('Network connection failed!');
toastUtils.warning('Low stock alert!');
toastUtils.info('Processing...');

// Common predefined toasts
commonToasts.loginSuccess();
commonToasts.loginError();
commonToasts.itemCreated('Product');
commonToasts.itemAddedToCart('iPhone 15');
commonToasts.paymentSuccess();
commonToasts.networkError();
```

### 3. Advanced Options

```javascript
// Custom duration (default: 5000ms for success/info, 7000ms for error, 6000ms for warning)
toast.success('Message', 'Title', { duration: 10000 });

// Custom ID for manual removal
const toastId = 'unique-id';
toast.success('Message', 'Title', { id: toastId });
toast.remove(toastId);

// Clear all toasts
toast.clear();
```

## API Reference

### useToast Hook

```javascript
const toast = useToast();

// Methods
toast.success(message, title?, options?)
toast.error(message, title?, options?)
toast.warning(message, title?, options?)
toast.info(message, title?, options?)
toast.remove(toastId)
toast.clear()
```

### toastUtils

```javascript
toastUtils.success(message, title?, options?)
toastUtils.error(message, title?, options?)
toastUtils.warning(message, title?, options?)
toastUtils.info(message, title?, options?)
```

### commonToasts

Pre-defined toast messages for common scenarios:

**Success Toasts:**
- `itemCreated(itemName)`
- `itemUpdated(itemName)`
- `itemDeleted(itemName)`
- `loginSuccess()`
- `logoutSuccess()`
- `orderPlaced()`
- `paymentSuccess()`
- `profileUpdated()`

**Error Toasts:**
- `loginError()`
- `networkError()`
- `serverError()`
- `validationError(message)`
- `itemNotFound(itemName)`
- `unauthorized()`
- `paymentError()`

**Warning Toasts:**
- `unsavedChanges()`
- `itemLowStock(itemName)`
- `sessionExpiring()`
- `formValidation(message)`

**Info Toasts:**
- `itemAddedToCart(itemName)`
- `itemRemovedFromCart(itemName)`
- `itemAddedToWishlist(itemName)`
- `processing()`
- `emailSent()`

## Helper Functions

### handleApiResponse

Automatically shows success or error toasts based on API response:

```javascript
import { handleApiResponse } from '../utils/toastUtils';

const response = await fetch('/api/endpoint');
handleApiResponse(response, 'Success message', 'Error message');
```

### handleFormSubmission

Handles form submissions with automatic toast notifications:

```javascript
import { handleFormSubmission } from '../utils/toastUtils';

const submitForm = async () => {
  await handleFormSubmission(
    () => submitApiCall(),
    'Form submitted successfully!',
    'Form submission failed!'
  );
};
```

## Styling

The toast system uses CSS classes for styling:

- `.toast-success` - Green styling for success toasts
- `.toast-error` - Red styling for error toasts  
- `.toast-warning` - Yellow styling for warning toasts
- `.toast-info` - Blue styling for info toasts

### Responsive Design

The toasts are fully responsive:
- Desktop: Fixed position at top-right
- Mobile: Full width at top with adjusted positioning

### Dark Mode Support

The CSS includes dark mode support using `prefers-color-scheme: dark`.

## Integration Examples

### Login Component
```jsx
// Show success toast on successful login
commonToasts.loginSuccess();

// Show error toast on failed login
toast.error(response.message || "Login failed", "Login Failed");
```

### Cart Operations
```jsx
// Adding item to cart
commonToasts.itemAddedToCart(productName);

// Removing item from cart
toast.success(`${item.name} removed from cart`, "Item Removed");

// Quantity update warnings
toast.warning("Minimum quantity is 1", "Cannot Decrease");
```

### Form Validation
```jsx
// Validation errors
toast.error("Please fill all required fields", "Validation Error");

// Success after form submission
toast.success("Profile updated successfully!", "Success");
```

## Demo

Visit `/toast-demo` in the application to see all toast types in action and test the functionality.

## Browser Support

The toast system works in all modern browsers and includes fallbacks for older browsers. The CSS animations use transforms and opacity for optimal performance.

## Performance

- Toasts are automatically removed after their duration expires
- Maximum of 5 toasts displayed at once (older ones are automatically removed)
- Smooth CSS animations with GPU acceleration
- Minimal bundle size impact

## Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast colors for better visibility
- Respect for user's motion preferences