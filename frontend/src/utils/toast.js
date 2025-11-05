// src/utils/toast.js
// Toast notification utilities

import toast from "react-hot-toast";

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: "top-center",
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
  });
};

// Info toast
export const showInfo = (message) => {
  toast(message, {
    icon: "ℹ️",
    duration: 3000,
    position: "top-center",
  });
};

// Warning toast
export const showWarning = (message) => {
  toast(message, {
    icon: "⚠️",
    duration: 3500,
    position: "top-center",
    style: {
      background: "#f59e0b",
      color: "#fff",
    },
  });
};

// Loading toast
export const showLoading = (message) => {
  return toast.loading(message, {
    position: "top-center",
  });
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Promise toast (for async operations)
export const showPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Error occurred",
    },
    {
      position: "top-center",
    }
  );
};
