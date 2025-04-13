import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/",
});

export const getTasks = () => API.get("tasks");
export const addTask = (task) => API.post("tasks", task);
