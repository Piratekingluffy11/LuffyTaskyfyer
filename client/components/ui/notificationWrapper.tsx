'use client'; // <-- This line is critical for using hooks in Next.js client components

import React from "react";
import { useTasks } from "@/context/taskContext";
import NotificationPopup from "@/components/ui/NotificationPopup"; // Make sure this path is correct

const NotificationWrapper = () => {
  const { notificationMessage, setNotificationMessage } = useTasks();

  return (
    <>
      {notificationMessage && (
        <NotificationPopup
          message={notificationMessage}
          onClose={() => setNotificationMessage(null)}
        />
      )}
    </>
  );
};

export default NotificationWrapper;
