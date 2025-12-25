
// Configuration
// ================================
const STD_ID = "12325715"; 
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "http://portal.almasar101.com/assignment/api";

// ================================
// DOM Elements
// ================================
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const tasksList = document.getElementById("tasks-list");
const statusDiv = document.getElementById("status");

// ================================
// Status Message Helper
// ================================
function setStatus(message, isError = false) {
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#555";
}

// ================================
// Load Tasks When Page Loads
// ================================
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
});

async function loadTasks() {
  setStatus("Fetching tasks...");

  try {
    const url =
      API_BASE +
      "/get.php?stdid=" +
      encodeURIComponent(STD_ID) +
      "&key=" +
      encodeURIComponent(API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not load tasks");
    }

    const data = await response.json();
    tasksList.innerHTML = "";

    if (data.success && Array.isArray(data.tasks)) {
      data.tasks.forEach(function (task) {
        appendTaskToList(task);
      });
      setStatus("");
    } else {
      setStatus("No tasks found");
    }
  } catch (error) {
    console.error(error);
    setStatus("Error loading tasks", true);
  }
}

// ================================
// Add New Task
// ================================
todoForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = taskInput.value.trim();
  if (title === "") return;

  setStatus("Adding task...");

  try {
    const url =
      API_BASE +
      "/add.php?stdid=" +
      encodeURIComponent(STD_ID) +
      "&key=" +
      encodeURIComponent(API_KEY);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    });

    if (!response.ok) {
      throw new Error("Add request failed");
    }

    const data = await response.json();

    if (data.success && data.task) {
      appendTaskToList(data.task);
      taskInput.value = "";
      setStatus("Task added");
    } else {
      setStatus("Failed to add task", true);
    }
  } catch (error) {
    console.error(error);
    setStatus("Error while adding task", true);
  }
});

// ================================
// Render Single Task
// ================================
function appendTaskToList(task) {
  const li = document.createElement("li");
  li.textContent = task.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", function () {
    deleteTask(task.id, li);
  });

  li.appendChild(deleteBtn);
  tasksList.appendChild(li);
}

// ================================
// Delete Task
// ================================
async function deleteTask(taskId, taskElement) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  setStatus("Deleting task...");

  try {
    const url =
      API_BASE +
      "/delete.php?stdid=" +
      encodeURIComponent(STD_ID) +
      "&key=" +
      encodeURIComponent(API_KEY) +
      "&id=" +
      encodeURIComponent(taskId);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Delete request failed");
    }

    const data = await response.json();

    if (data.success) {
      taskElement.remove();
      setStatus("Task deleted");
    } else {
      setStatus("Could not delete task", true);
    }
  } catch (error) {
    console.error(error);
    setStatus("Error while deleting task", true);
  }
}
