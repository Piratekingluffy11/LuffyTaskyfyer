// components/ui/NotificationPopup.tsx
import React from "react";

interface NotificationPopupProps {
  message: string;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ message, onClose }) => {
  return (
    <div
      className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
      style={{ zIndex: 9999 }}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-xl">X</button>
    </div>
  );
};

export default NotificationPopup;
