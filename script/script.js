const newListForm = document.getElementById("new-list-form");
const newListInput = document.getElementById("new-list-input");
const listsWrapper = document.getElementById("lists-wrapper");

const STORAGE_KEY = "todoLists";
let todoLists = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveLists() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoLists));
}

function getSortedTasks(tasks, sortType) {
  const sorted = [...tasks];

  switch (sortType) {
    case "status":
      return sorted.sort((a, b) => a.completed - b.completed);
    case "az":
      return sorted.sort((a, b) => a.text.localeCompare(b.text));
    case "za":
      return sorted.sort((a, b) => b.text.localeCompare(a.text));
    default:
      return tasks;
  }
}

function renderAllListsWithTasks() {
  listsWrapper.innerHTML = "";

  todoLists.forEach((list) => {
    const listBox = document.createElement("div");
    listBox.classList.add("list-box");

    const title = document.createElement("h3");
    title.textContent = list.name;

    const form = document.createElement("form");
    form.classList.add("task-form");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Нова задача";
    input.required = true;

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Task";

    form.appendChild(input);
    form.appendChild(addBtn);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskText = input.value.trim();
      if (!taskText) return;

      list.tasks.push({
        id: Date.now().toString(),
        text: taskText,
        completed: false,
      });

      saveLists();
      renderAllListsWithTasks();
    });

    const sortSelect = document.createElement("select");
    sortSelect.innerHTML = `
      <option value="">Sort...</option>
      <option value="status">By Status</option>
      <option value="az">A-Z</option>
      <option value="za">Z-A</option>
    `;

    sortSelect.value = list.sortType || "";

    sortSelect.addEventListener("change", () => {
      list.sortType = sortSelect.value;
      saveLists();
      renderAllListsWithTasks();
    });

    const ul = document.createElement("ul");
    const sortType = list.sortType || "";
    const sortedTasks = getSortedTasks(list.tasks, sortType);

    sortedTasks.forEach((task) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveLists();
        renderAllListsWithTasks();
      });

      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.completed) {
        span.style.textDecoration = "line-through";
        span.style.color = "#888";
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.addEventListener("click", () => {
        list.tasks = list.tasks.filter((t) => t.id !== task.id);
        saveLists();
        renderAllListsWithTasks();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      ul.appendChild(li);
    });

    const removeListBtn = document.createElement("button");
    removeListBtn.textContent = "Remove List";
    removeListBtn.classList.add("remove-list-btn");
    removeListBtn.addEventListener("click", () => {
      todoLists = todoLists.filter((l) => l.id !== list.id);
      saveLists();
      renderAllListsWithTasks();
    });

    listBox.appendChild(title);
    listBox.appendChild(form);
    listBox.appendChild(sortSelect);
    listBox.appendChild(ul);
    listBox.appendChild(removeListBtn);

    listsWrapper.appendChild(listBox);
  });
}

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value.trim();
  if (!listName) return;

  const newList = {
    id: Date.now().toString(),
    name: listName,
    tasks: [],
  };

  todoLists.push(newList);
  saveLists();
  newListInput.value = "";
  renderAllListsWithTasks();
});

renderAllListsWithTasks();
