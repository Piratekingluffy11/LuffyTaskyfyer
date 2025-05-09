"use client";
import React, { useState } from "react";
import { useTasks } from "@/context/taskContext";
import { Bell } from "lucide-react";
import Link from "next/link";

const NotificationButton = () => {
  const {
    notifications,
    unseenNotificationsCount,
    markNotificationsAsSeen,
  }: {
    notifications: { id: string; link: string; message: string; seen: boolean }[];
    unseenNotificationsCount: number;
    markNotificationsAsSeen: () => void;
  } = useTasks();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    markNotificationsAsSeen();
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unseenNotificationsCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unseenNotificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded shadow-lg z-50">
          <div className="p-4 text-sm">
            <h3 className="font-semibold mb-2">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications.</p>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.link}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-1 rounded hover:bg-gray-100 ${
                    !notif.seen ? "font-bold" : "text-gray-500"
                  }`}
                >
                  {notif.message}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
