"use client";
import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const TasksContext = createContext();

const serverUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001/api/v1"
    : "https://taskfyer.onrender.com/api/v1";

const axiosWithCreds = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

const defaultTask = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().slice(0, 10),
  priority: "low",
  completed: false,
};

export const TasksProvider = ({ children }) => {
  const { user } = useUserContext();
  const userId = user?._id;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(defaultTask);
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState("all");
  const [activeTask, setActiveTask] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [profileModal, setProfileModal] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(0);

  const triggerNotification = (message, link = "/tasks") => {
    const newNotification = {
      id: uuidv4(),
      message,
      link,
      seen: false,
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnseenNotificationsCount((prev) => prev + 1);
  };

  const markNotificationsAsSeen = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    setUnseenNotificationsCount(0);
  };

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask(defaultTask);
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => setProfileModal(true);

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask(defaultTask);
  };

  const getTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axiosWithCreds.get("/tasks");
      const fetchedTasks = res.data.tasks || [];
      setTasks(fetchedTasks);
      checkForNotifications(fetchedTasks);
    } catch (error) {
      console.error("Error getting tasks", error);
      toast.error("Failed to fetch tasks.");
    }
    setLoading(false);
  };

  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const res = await axiosWithCreds.get(`/task/${taskId}`);
      setTask(res.data);
    } catch (error) {
      console.error("Error getting task", error);
      toast.error("Failed to get task.");
    }
    setLoading(false);
  };

  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axiosWithCreds.post("/task/create", task);
      setTasks((prev) => [...prev, res.data]);
      toast.success("Task created successfully!");
      triggerNotification("✅ Task created successfully!");
    } catch (error) {
      console.error("Error creating task", error);
      toast.error(error?.response?.data?.message || "Failed to create task.");
    }
    setLoading(false);
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const res = await axiosWithCreds.patch(`/task/${task._id}`, task);
      setTasks((prev) =>
        prev.map((t) => (t._id === res.data._id ? res.data : t))
      );
      toast.success("Task updated successfully!");
      triggerNotification(task.completed ? "🎉 Task completed!" : "✏️ Task updated!");
    } catch (error) {
      console.error("Error updating task", error);
      toast.error("Failed to update task.");
    }
    setLoading(false);
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axiosWithCreds.delete(`/task/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      // Remove from notified list in localStorage too
      const notified = JSON.parse(localStorage.getItem("notifiedTaskIds") || "[]");
      localStorage.setItem(
        "notifiedTaskIds",
        JSON.stringify(notified.filter((id) => id !== taskId))
      );

      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Failed to delete task.");
    }
    setLoading(false);
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      let value = e.target.value;
      if (name === "completed") {
        value = value === "true";
      }
      setTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed);

  // ✅ FIXED: Check for overdue tasks only once per task (using localStorage)
  const checkForNotifications = (tasks) => {
    const currentDate = new Date();
    const seenTaskIds = JSON.parse(localStorage.getItem("notifiedTaskIds") || "[]");

    const newNotifications = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && dueDate <= currentDate && !seenTaskIds.includes(task._id);
    });

    if (newNotifications.length > 0) {
      newNotifications.forEach((task) => {
        triggerNotification(`⚠️ Task "${task.title}" is overdue!`, "/tasks");
      });

      const updatedIds = [
        ...new Set([...seenTaskIds, ...newNotifications.map((t) => t._id)]),
      ];
      localStorage.setItem("notifiedTaskIds", JSON.stringify(updatedIds));
    }

    const unseen = notifications.filter((n) => !n.seen).length;
    setUnseenNotificationsCount(unseen);
  };

  useEffect(() => {
    const alertedTaskIds = new Set();
  
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        const due = new Date(task.dueDate);
        const timeLeft = due.getTime() - now.getTime();
  
        if (
          !task.completed &&
          timeLeft > 0 &&
          timeLeft <= 15 * 60 * 1000 &&
          !alertedTaskIds.has(task._id)
        ) {
          const message = `⏰ Task "${task.title}" is due in ${Math.floor(timeLeft / 60000)} minutes!`;
  
          // Show toast
          toast(message, {
            icon: "⏳",
            duration: 6000,
          });
  
          // Trigger in-app notification
          triggerNotification(message);
  
          // Remember that we alerted this task
          alertedTaskIds.add(task._id);
        }
      });
    }, 60000);
  
    return () => clearInterval(interval);
  }, [tasks]);
  

  useEffect(() => {
    if (userId) getTasks();
  }, [userId]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        setTask,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        profileModal,
        activeTasks,
        completedTasks,
        notifications,
        unseenNotificationsCount,
        markNotificationsAsSeen,
        triggerNotification,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
