// hooks/useModal.js
import { useEffect } from "react";

export const useModal = (isOpen, onClose) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose(); // ESC key
    };

    const handleClickOutside = (e) => {
      if (e.target === e.currentTarget) onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return {
    handleBackdropClick: (e) => {
      if (e.target === e.currentTarget) onClose();
    },
  };
};
