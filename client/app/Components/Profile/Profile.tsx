"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import React from "react";

function Profile() {
  const { user } = useUserContext();
  const { tasks, activeTasks, completedTasks, openProfileModal } = useTasks();

  return (
    <div className="m-4 sm:m-6">
      <div
        className="px-4 py-4 flex items-center gap-4 bg-[#E6E6E6]/20 rounded-xl
        hover:bg-[#E6E6E6]/50 transition duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-white"
        onClick={openProfileModal}
      >
        <Image
          src={user?.photo}
          alt="avatar"
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="flex flex-col text-lg sm:text-xl">
            <span className="font-medium">Hello,</span>
            <span className="font-bold">{user?.name}</span>
          </h1>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Total Tasks", count: tasks.length, color: "bg-purple-500" },
            { label: "In Progress", count: activeTasks.length, color: "bg-[#3AAFAE]" },
            { label: "Open Tasks", count: activeTasks.length, color: "bg-orange-400" },
            { label: "Completed", count: completedTasks.length, color: "bg-green-400" },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-gray-500 dark:text-gray-300">
              <p>{label}:</p>
              <p className="pl-4 relative flex gap-2 items-center">
                <span
                  className={`absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 -translate-y-1/2 rounded-sm ${color}`}
                ></span>
                <span className="font-semibold text-3xl sm:text-4xl text-[#333] dark:text-white">
                  {count}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mt-8 font-medium text-gray-800 dark:text-gray-200">Activity</h3>
      
    </div>
  );
}

export default Profile;
