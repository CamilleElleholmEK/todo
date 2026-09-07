"use strict";

// Const
const taskText = document.querySelector("#taskText");
const taskList = document.querySelector("#taskList");
const doneList = document.querySelector("#doneList");
const createBtn = document.querySelector("#create");
const taskArray = [];
const doneArray = [];

// Eventlisteners
document.querySelector("#create").addEventListener("click", create);
taskText.addEventListener("keypress", (e) => {
  // If the user presses the "Enter" key on the keyboard
  if (e.key === "Enter" && taskText.value !== "") {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    createBtn.click();
  }
});

// Eventdelegation
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    removeTask(e);
  } else if (e.target.type === "checkbox") {
    console.log("checkbox clicked", e.target);
    create(e);
  }
});
doneList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    removeDoneTask(e);
  }
});

// *********************************** Push new and done tasks to arrays *********************
function create(e) {
  const taskObject = {
    taskText: taskText.value,
    taskDone: false,
    id: self.crypto.randomUUID(),
  };
  if (e.currentTarget === createBtn) {
    taskArray.push(taskObject);
    displayList(taskArray);
    console.log("currentTarget:", e.currentTarget, "target:", e.target);
  } else if (e.target.type === "checkbox") {
    const doneId = e.target.closest("li").dataset.id;
    const doneTask = taskArray.find((task) => task.id === doneId);
    doneTask.taskDone = true;
    doneArray.push(doneTask);
    displayDoneList(doneArray);
    removeTask(e);
  }
}

// ************************************ Building tasks and rendering list ***********************
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

// ****************************************** Building and rendering done list *******************************
function displayDoneList(arr) {
  console.log("displayDoneList kørt med", arr);
  doneList.innerHTML = "";
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
    checkbox.checked = true;
    description.classList.add("taskDescription");
    date.classList.add("date");
    del.classList.add("deleteBtn");

    // Insert Elements in li
    li.append(checkbox, description, date, del);
    doneList.appendChild(li);
  });
  taskText.value = "";
}

// ****************************************** Remove tasks ****************************
// Task list
function removeTask(e) {
  const deletedTask = e.target.closest("li");
  const taskId = taskArray.findIndex(
    (task) => task.id === deletedTask.dataset.id,
  );
  taskArray.splice(taskId, 1);
  console.log(taskId);
  displayList(taskArray);
}

// Done list
function removeDoneTask(e) {
  const deletedTask = e.target.closest("li");
  const taskId = doneArray.findIndex(
    (task) => task.id === deletedTask.dataset.id,
  );
  doneArray.splice(taskId, 1);
  displayDoneList(doneArray);
}
