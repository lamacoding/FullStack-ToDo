const addTaskButton = document.getElementById("button-addon2");
const taskInput = document.querySelector(".input-group input");
const taskList = document.querySelector(".todo-list-container ul");

addTaskButton.addEventListener("click", addItem);
taskInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

window.onload = function () {
  taskInput.focus();
};

function init() {
  fetch("/tasks").then((response) => response.json()).then((data) => {
    data.forEach((task) => {
      console.log(task);
      const taskElement = document.createElement("li");
      taskElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      taskElement.innerHTML = `
          ${task.done ? `<s>${task.task}</s>` : task.task}
          <div class="d-flex gap-3 ms-5">
            <span class="material-symbols-rounded clickable text-secondary" title="Edit task">edit</span>
            <span class="material-symbols-rounded clickable text-danger delete-task" title="Delete task">delete</span>
          </div>
        `;
      const deleteButton = taskElement.querySelector('.delete-task');

      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Stop propagation between the delete button and the task item
        deleteTask(task.id);
      });

      taskElement.addEventListener('click', () => {
        itemClicked(task.id);
      });

      taskList.appendChild(taskElement);
    });
  });
}

function itemClicked(id) {
  console.log("item clicked");
  fetch(`/itemClicked/${id}`, { method: "PUT" }).then((response) => response.json()).then((data) => {
    console.log(data);
  });
  location.reload();
}

function deleteTask(id) {
  fetch(`/delete/${id}`, { method: "DELETE" }).then((response) => response.json()).then((data) => {
    console.log(data);
  });
  location.reload();
}

function addItem() {
  const task = taskInput.value;
  if (task) {
    fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        location.reload();
      });
  }
}



init();
