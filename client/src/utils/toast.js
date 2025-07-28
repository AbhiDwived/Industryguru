import { toast } from 'react-toastify';

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  warning: (message) => toast.warning(message),
  info: (message) => toast.info(message),
  loading: (message) => toast.loading(message),
  promise: (promise, messages) => toast.promise(promise, messages)
};