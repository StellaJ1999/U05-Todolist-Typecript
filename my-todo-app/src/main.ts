import './style.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

let todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const clearListButton = document.getElementById("clear-list") as HTMLButtonElement;

function addTodo(): void {
  if (todoInput.value.trim() === "") return;

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: todoInput.value,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = ''; // Rensar fältet efter att ha lagt till en todo
}

function clearTodos(): void {
  todos = [];
  saveTodos();
  renderTodos();
}

clearListButton.addEventListener("click", clearTodos);

function saveTodos(): void {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Kunde inte spara todos i localStorage", error);
  }
}

function renderTodos(): void {
  todoList.innerHTML = ''; // Rensa listan innan rendering
  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  addTodo();
});

renderTodos();
