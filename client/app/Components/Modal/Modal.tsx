"use client";
import { useTasks } from "@/context/taskContext";
import useDetectOutside from "@/hooks/useDetectOutside";
import React, { useEffect, useRef } from "react";

function Modal() {
  const {
    task,
    handleInput,
    createTask,
    isEditing,
    closeModal,
    modalMode,
    activeTask,
    updateTask,
    setTask,
  } = useTasks();

  const ref = useRef(null);

  useDetectOutside({
    ref,
    callback: () => {
      if (isEditing) closeModal();
    },
  });

  const defaultTask = {
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    completed: false,
  };

  // Correct date format for input[type="date"] — yyyy-MM-dd
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // yyyy-MM-dd
  };

  useEffect(() => {
    if (modalMode === "edit" && activeTask) {
      const formattedDueDate = activeTask.dueDate
        ? formatDateForInput(activeTask.dueDate)
        : "";
      setTask({ ...defaultTask, ...activeTask, dueDate: formattedDueDate });
    } else if (modalMode === "add") {
      setTask(defaultTask);
    }
  }, [modalMode, activeTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalMode === "edit") updateTask(task);
    else if (modalMode === "add") createTask(task);
    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        ref={ref}
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="text"
            id="title"
            placeholder="Task Title"
            name="title"
            value={task.title || ""}
            onChange={(e) => handleInput("title")(e)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
            name="description"
            placeholder="Task Description"
            rows={4}
            value={task.description || ""}
            onChange={(e) => handleInput("description")(e)}
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priority">Select Priority</label>
          <select
            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
            name="priority"
            value={task.priority || "low"}
            onChange={(e) => handleInput("priority")(e)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                id="dueDate"
                className="bg-[#F9F9F9] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3aafae] transition"
                type="date"
                name="dueDate"
                value={task.dueDate || ""}
                min={new Date().toISOString().split("T")[0]} // 💡 Prevent past dates
                onChange={(e) => handleInput("dueDate")(e)}
              />
        </div>


        {/* Completed */}
        <div className="flex flex-col gap-1">
          <label htmlFor="completed">Task Completed</label>
          <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
            <label htmlFor="completed">Completed</label>
            <div>
              <select
                className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
                name="completed"
                value={task.completed ? "true" : "false"}
                onChange={(e) => handleInput("completed")(e)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className={`text-white py-2 rounded-md w-full hover:bg-blue-500 transition duration-200 ease-in-out ${
              modalMode === "edit" ? "bg-blue-400" : "bg-green-400"
            }`}
          >
            {modalMode === "edit" ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
