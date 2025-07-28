import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      const { id, type, message, title, duration = 5000 } = action.payload;
      
      const toast = {
        id: id || Date.now() + Math.random(),
        type: type || 'info',
        message,
        title,
        duration,
        isVisible: true,
        isPaused: false,
        createdAt: Date.now(),
      };
      
      state.toasts.push(toast);
      
      // Limit the number of toasts to prevent screen overflow
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(-5);
      }
    },
    
    removeToast: (state, action) => {
      const toastId = action.payload;
      state.toasts = state.toasts.filter(toast => toast.id !== toastId);
    },
    
    pauseToast: (state, action) => {
      const toastId = action.payload;
      const toast = state.toasts.find(t => t.id === toastId);
      if (toast) {
        toast.isPaused = true;
      }
    },
    
    resumeToast: (state, action) => {
      const toastId = action.payload;
      const toast = state.toasts.find(t => t.id === toastId);
      if (toast) {
        toast.isPaused = false;
      }
    },
    
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

// Action creators for different toast types
export const showSuccessToast = (message, title, options = {}) => (dispatch) => {
  const toastId = options.id || Date.now() + Math.random();
  dispatch(addToast({
    id: toastId,
    type: 'success',
    message,
    title,
    ...options,
  }));
  
  // Auto-remove after duration
  const duration = options.duration || 5000;
  setTimeout(() => {
    dispatch(removeToast(toastId));
  }, duration);
};

export const showErrorToast = (message, title, options = {}) => (dispatch) => {
  const toastId = options.id || Date.now() + Math.random();
  dispatch(addToast({
    id: toastId,
    type: 'error',
    message,
    title,
    duration: options.duration || 7000, // Error toasts stay longer
    ...options,
  }));
  
  // Auto-remove after duration
  const duration = options.duration || 7000;
  setTimeout(() => {
    dispatch(removeToast(toastId));
  }, duration);
};

export const showWarningToast = (message, title, options = {}) => (dispatch) => {
  const toastId = options.id || Date.now() + Math.random();
  dispatch(addToast({
    id: toastId,
    type: 'warning',
    message,
    title,
    duration: options.duration || 6000, // Warning toasts stay a bit longer
    ...options,
  }));
  
  // Auto-remove after duration
  const duration = options.duration || 6000;
  setTimeout(() => {
    dispatch(removeToast(toastId));
  }, duration);
};

export const showInfoToast = (message, title, options = {}) => (dispatch) => {
  const toastId = options.id || Date.now() + Math.random();
  dispatch(addToast({
    id: toastId,
    type: 'info',
    message,
    title,
    ...options,
  }));
  
  // Auto-remove after duration
  const duration = options.duration || 5000;
  setTimeout(() => {
    dispatch(removeToast(toastId));
  }, duration);
};

export const { addToast, removeToast, pauseToast, resumeToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;