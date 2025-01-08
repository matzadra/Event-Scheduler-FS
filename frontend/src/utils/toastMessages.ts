import { toast, ToastOptions } from "react-toastify";

export const showError = (message: string) => toast.error(message);
export const showSuccess = (message: string) => toast.success(message);
export const showInfo = (message: string) => toast.info(message);
export const showDynamicToast = (message: string, options: ToastOptions = {}) =>
  toast(message, { ...options });
export const updateToast = (
  toastId: string | number,
  options: ToastOptions & { render: string }
) => toast.update(toastId, options);
