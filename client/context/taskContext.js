import axios from "axios";
import React, { createContext, useEffect, useState, useContext } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001/api/v1"
    : "https://taskfyer.onrender.com/api/v1";

// Axios instance with credentials
const axiosWithCreds = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

// Default shape for a new task
const defaultTask = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().slice(0, 10), // yyyy-mm-dd (local-safe)
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

  // Open modal to create new task
  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask(defaultTask);
  };

  // Open modal to edit existing task
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
      setTasks(res.data.tasks || []);
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
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Failed to delete task.");
    }
    setLoading(false);
  };

  // Input handler that supports type conversion
  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e); // entire object replacement
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

  useEffect(() => {
    if (userId) {
      getTasks();
    }
  }, [userId]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        setTask, // ✅ Expose setTask for direct edits
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
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
