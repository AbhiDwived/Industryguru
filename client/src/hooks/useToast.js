import { useDispatch } from 'react-redux';
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast,
  removeToast,
  clearAllToasts
} from '../Store/Slices/toastSlice';

const useToast = () => {
  const dispatch = useDispatch();

  const toast = {
    success: (message, title = 'Success', options = {}) => {
      dispatch(showSuccessToast(message, title, options));
    },
    
    error: (message, title = 'Error', options = {}) => {
      dispatch(showErrorToast(message, title, options));
    },
    
    warning: (message, title = 'Warning', options = {}) => {
      dispatch(showWarningToast(message, title, options));
    },
    
    info: (message, title = 'Info', options = {}) => {
      dispatch(showInfoToast(message, title, options));
    },
    
    remove: (toastId) => {
      dispatch(removeToast(toastId));
    },
    
    clear: () => {
      dispatch(clearAllToasts());
    }
  };

  return toast;
};

export default useToast;