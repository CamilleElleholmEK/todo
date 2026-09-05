"use strict";

// Const
const taskText = document.querySelector("#taskText");
const taskList = document.querySelector("#taskList");
const taskArray = [];

// Eventlisteners
document.querySelector("#create").addEventListener("click", create);
// Eventdelegation
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    removeTask(e);
  }
});

// Create new task and push to array
function create(e) {
  const taskObject = {
    taskText: taskText.value,
    taskDone: false,
    id: self.crypto.randomUUID(),
  };
  taskArray.push(taskObject);
  console.log(taskArray);
  displayList(taskArray);
}

// Building tasks and rendering list
function displayList(arr) {
  taskList.innerHTML = "";
  arr.forEach((task) => {
    // Create elements
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const description = document.createElement("p");
    const date = document.createElement("p");
    const del = document.createElement("button");

    // Element content
    checkbox.type = "checkbox";
    description.innerHTML = `${task.taskText}`;
    date.innerHTML = "dato";
    del.innerHTML = "X";

    // Element class & data
    li.classList.add("task");
    li.dataset.id = `${task.id}`;
    checkbox.classList.add("checkbox");
    description.classList.add("taskDescription");
    date.classList.add("date");
    del.classList.add("deleteBtn");

    // Insert Elements in li
    li.append(checkbox, description, date, del);
    taskList.appendChild(li);
  });
  taskText.value = "";
}

// Remove task
function removeTask(e) {
  const deletedTask = e.target.closest("li");
  const taskId = taskArray.findIndex(
    (task) => task.id === deletedTask.dataset.id,
  );
  taskArray.splice(taskId, 1);
  console.log(taskId);
  displayList(taskArray);
}
