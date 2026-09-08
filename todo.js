"use strict";

import { loadJSON } from "/utils_lib.js";

// Const
const taskText = document.querySelector("#taskText");
const dateField = document.querySelector("#date");
const outdoorCheck = document.querySelector("#outdoorCheck");
const taskList = document.querySelector("#taskList");
const doneList = document.querySelector("#doneList");
const createBtn = document.querySelector("#create");
const taskTextContainer = document.querySelector("#taskTextContainer");
const openPopup = document.querySelector("#openPopup");
const closePopup = document.querySelector("#closePopup");
const taskArray = [];
const doneArray = [];
const wwCodes = {
  0: "clearsky_day.png",
  1: "fair_day.png",
  2: "partlycloudy_day.png",
  3: "cloudy.png",
  45: "fog.png",
  48: "fog.png",
  // it's raining again👇🏼
  51: "lightrain.png",
  53: "lightrain.png",
  55: "lightrain.png",
  56: "lightsleet.png",
  57: "lightsleet.png",
  61: "lightrain.png",
  63: "rain.png",
  65: "heavyrain.png",
  66: "lightsleet.png",
  67: "lightsleet.png",
  71: "lightsnow.png",
  73: "snow.png",
  75: "heavysnow.png",
  77: "lightsnow.png",
  80: "lightrainshowers_day.png",
  81: "rainshowers_day.png",
  82: "heavyrainshowers_day.png",
  85: "lightsnowshowers_day.png",
  86: "heavysnowshowers_day.png",
  95: "rainandthunder.png",
};

// Eventlisteners
createBtn.addEventListener("click", create);
openPopup.addEventListener("click", popup);
closePopup.addEventListener("click", popup);
taskText.addEventListener("keypress", (e) => {
  // If the user presses the "Enter" key on the keyboard
  if (e.key === "Enter" && taskText.value !== "") {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    createBtn.click();
  }
});

// **************************************** Event delegation *********************
// Task list
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    removeTask(e);
  } else if (e.target.type === "checkbox") {
    create(e);
  }
});
// Done list
doneList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    removeDoneTask(e);
  } else if (e.target.type === "checkbox") {
    create(e);
  }
});

// *********************************** Open and close popup **********************************
function popup(e) {
  document.querySelector("#taskTextContainer").classList.remove("hide");
  if (e.target === openPopup) {
    taskTextContainer.classList.remove("hide");
  } else if (e.target === closePopup) {
    taskTextContainer.classList.add("hide");
  }
}

// *********************************** Push new and done tasks to arrays *********************
function create(e) {
  const taskObject = {
    taskText: taskText.value,
    taskDate: dateField.value,
    taskDone: false,
    taskOutdoor: outdoorCheck.checked,
    id: self.crypto.randomUUID(),
  };

  if (e.currentTarget === createBtn) {
    loadJSON(
      `https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.57&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${taskObject.taskDate}&end_date=${taskObject.taskDate}`,
      (data) => {
        taskObject.weatherCode = data.daily.weathercode[0];
        taskArray.push(taskObject);
        displayList(taskArray, taskList);
      },
    );
    taskTextContainer.classList.add("hide");
  } else if (e.target.type === "checkbox") {
    const doneId = e.target.closest("li").dataset.id;
    if (
      // target.checked = true, er hvis tasket ikke er done. omvendt logik
      e.target.checked === true
    ) {
      const doneTask = taskArray.find((task) => task.id === doneId);
      doneTask.taskDone = true;
      doneArray.push(doneTask);
      displayList(doneArray, doneList);
      removeTask(e);
    } else {
      const removedDoneTask = doneArray.find((task) => task.id === doneId);
      removedDoneTask.taskDone = false;
      taskArray.push(removedDoneTask);
      displayList(taskArray, taskList);
      removeDoneTask(e);
    }
  }
}

// ************************************ Building tasks and rendering lists ***********************
function displayList(arr, list) {
  list.innerHTML = "";
  arr.forEach((task) => {
    // Create elements
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const description = document.createElement("p");
    const date = document.createElement("p");
    const weather = document.createElement("img");
    const del = document.createElement("button");
    const convertedDateY = task.taskDate.substring(0, 4);
    const convertedDateM = task.taskDate.substring(5, 7);
    const convertedDateD = task.taskDate.substring(8, 10);

    // Element content
    checkbox.type = "checkbox";
    description.innerHTML = `${task.taskText}`;
    date.innerHTML =
      convertedDateD + " / " + convertedDateM + " / " + convertedDateY;
    weather.src = `png/${wwCodes[task.weatherCode]}`;
    del.innerHTML = "X";

    // Element class & data
    li.classList.add("task");
    li.dataset.id = `${task.id}`;
    checkbox.classList.add("checkbox");
    checkbox.checked = task.taskDone;
    description.classList.add("taskDescription");
    date.classList.add("date");
    del.classList.add("deleteBtn");
    // Tilføj styling til udendørs tasks
    if (task.taskOutdoor === true) {
      li.classList.add("outdoor");
    }

    // Insert Elements in li
    li.append(checkbox, description, date, weather, del);
    list.appendChild(li);
  });

  taskText.value = "";
  outdoorCheck.checked = false;
  dateField.value = undefined;
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
  displayList(taskArray, taskList);
}

// Done list
function removeDoneTask(e) {
  const deletedTask = e.target.closest("li");
  const taskId = doneArray.findIndex(
    (task) => task.id === deletedTask.dataset.id,
  );
  doneArray.splice(taskId, 1);
  displayList(doneArray, doneList);
}
