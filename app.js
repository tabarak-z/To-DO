// File: js/app.js
// Student: tabarak zitawi (12429377)

// Configuration
const STUDENT_ID = "12429377";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";


const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");


function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}


document.addEventListener("DOMContentLoaded", async () => {
  setStatus("Loading tasks...");
  try {
    const res = await fetch(`${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`);
    const data = await res.json();

    if (data.tasks) {
      data.tasks.forEach(task => {
        appendTaskToList(task);
      });
    }
    setStatus("");
  } catch (err) {
    setStatus("Error loading tasks", true);
    console.error(err);
  }
});


if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    setStatus("Adding task...");
    try {
      const res = await fetch(`${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (data.success) {
        appendTaskToList(data.task);
        input.value = "";
        setStatus("Task added successfully");
      } else {
        setStatus("Failed to add task", true);
      }
    } catch (err) {
      setStatus(err.message, true);
      console.error(err);
    }
  });
}


function appendTaskToList(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => deleteTask(task.id, li));

  li.appendChild(span);
  li.appendChild(deleteBtn);
  list.appendChild(li);
}
async function deleteTask(id, liElement) {
  if (!confirm("Delete this task?")) return;

  try {
    const res = await fetch(`${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${id}`);
    const data = await res.json();

    if (data.success) {
      liElement.remove();
      setStatus("Task deleted");
    } else {
      setStatus("Failed to delete task", true);
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message, true);
  }
}  