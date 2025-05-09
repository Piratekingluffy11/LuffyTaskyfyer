// components/Header/Header.tsx

"use client";

import React, { useState } from "react";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { github, moon, profile } from "@/utils/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationButton from "@/components/ui/notificationButton";
import NotificationPopup from "@/components/ui/NotificationPopup"; // Adjusted the import path

function Header() {
  const { user } = useUserContext();
  const { openModalForAdd } = useTasks();
  const { activeTasks, hasNotifications } = useTasks();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const { name } = user;
  const userId = user._id;
  
  
  // Logic to show the popup (if there are active tasks)
  const handleNotificationClick = () => {
    if (hasNotifications) {
      setShowPopup(true); // Show popup when user has active tasks
      setTimeout(() => setShowPopup(false), 5000); // Automatically close after 5 seconds
    }
  };

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          {userId ? `Welcome, ${name}!` : "Welcome to Taskfyer"}
        </h1>
        <p className="text-sm">
          {userId ? (
            <>
              You have{" "}
              <span className="font-bold text-[#3aafae]">
                {activeTasks.length}
              </span>{" "}
              active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>

      <div className="h-[50px] flex items-center gap-[3rem]">
        <button
          className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px]
          hover:bg-[#00A1F1] hover:text-white transition-all duration-200 ease-in-out"
          onClick={() => {
            if (userId) {
              openModalForAdd(); // Assuming you have modal for adding tasks
            } else {
              router.push("/login");
            }
          }}
        >
          {userId ? "Add a new Task" : "Login / Register"}
        </button>

        <div className="flex gap-4 items-center">
          {/* ✅ Notification Button */}
          <NotificationButton />

          {/* GitHub */}
          <Link
            href="https://github.com/PirateKingluffy11"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-[40px] w-[40px] text-charcoal-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {github}
          </Link>

          {/* Theme Switch / Moon Icon */}
          <Link
            href="#"
            passHref
            className="h-[40px] w-[40px] text-charcoal-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {moon}
          </Link>

          {/* Profile */}
          <Link
            href="#"
            passHref
            className="h-[40px] w-[40px] text-charcoal-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {profile}
          </Link>
        </div>
      </div>

      {/* Show notification popup */}
     
    </header>
  );
}

export default Header;
