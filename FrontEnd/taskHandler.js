const addTaskButton = document.getElementById("button-addon2");
const taskInput = document.querySelector(".input-group input");
const taskList = document.querySelector(".todo-list-container ul");
const taskField = document.querySelectorAll(".task-field");

for (const taskFieldElement of taskField) {
  taskFieldElement.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

addTaskButton.addEventListener('click', addItem);
taskInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    addItem();
  }
});

window.onload = function () {
  taskInput.focus();
};

function editTask(id) {
  const inputTask = document.getElementById(`input-task-${id}`);
  const spanTask = document.getElementById(`span-task-${id}`);
  if(inputTask.classList.contains('hidden')) {
    inputTask.classList.remove('hidden');
    spanTask.classList.add('hidden');
  } else {
    inputTask.classList.add('hidden');
    spanTask.classList.remove('hidden');
  }
  inputTask.focus();

  inputTask.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateTask(id, inputTask.value);
    }
  });
}

function updateTask(id, task) {
  fetch(`/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({task}),
  }).then((response) => response.json()).then((data) => {
    console.log(data);
  });
  location.reload();
}

function init() {
  fetch("/tasks").then((response) => response.json()).then((data) => {
    data.forEach((task) => {
      const taskElement = document.createElement("li");
      taskElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      taskElement.innerHTML = `<input type="checkbox" id="checkbox-done" ${task.done && "checked"}>
          <input type="text" value="${task.task}" class="hidden form-control ms-3 task-field ${task.done && "text-success"}" id="input-task-${task.id}">
          <span class="form-control-plaintext ms-3 task-field ${task.done && "text-success"}" id="span-task-${task.id}">${task.task}</span>
          <div class="d-flex gap-3 ms-5">
            <span class="material-symbols-rounded clickable text-secondary" title="Edit task" id="edit-task">edit</span>
            <span class="material-symbols-rounded clickable text-danger" title="Delete task" id="delete-task">delete</span>
          </div>
        `;
      const checkboxDone = taskElement.querySelector('#checkbox-done')
      const deleteButton = taskElement.querySelector('#delete-task');
      const editButton = taskElement.querySelector('#edit-task');

      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Stop propagation between the delete button and the task item
        deleteTask(task.id);
      });

      editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        editTask(task.id);
      });

      checkboxDone.addEventListener('click', (event) => {
        event.stopPropagation();
        itemClicked(task.id);
      })

      // taskElement.addEventListener('click', () => {
      //   itemClicked(task.id);
      // });

      taskList.appendChild(taskElement);
    });
  });
}

function itemClicked(id) {
  fetch(`/itemClicked/${id}`, {method: "PUT"}).then((response) => response.json()).then((data) => {
    console.log(data);
  });
  location.reload();
}

function deleteTask(id) {
  fetch(`/delete/${id}`, {method: "DELETE"}).then((response) => response.json()).then((data) => {
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
      body: JSON.stringify({task}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        location.reload();
      });
  }
}


init();
