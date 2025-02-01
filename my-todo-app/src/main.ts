import { checkAuth } from './authHandler';
import { supabase } from './supabase';
import "./style.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
}

let todos: Todo[] = [];

const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const clearListButton = document.getElementById("clear-list") as HTMLButtonElement;

export async function fetchTodos() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return;
  }
  if (!user) return;

  const { data, error: fetchError } = await supabase.from("todos").select("*").eq("user_id", user.id);
  if (fetchError) {
    console.error("Error fetching todos:", fetchError);
    return;
  }

  todos = data || [];
  renderTodos();
}

function addTodo(): void {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: todoInput.value,
    completed: false,
    user_id: "", 
  };

  supabase.auth.getUser().then(({ data: { user }, error }) => {
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    if (user) {
      newTodo.user_id = user.id;
      todos.push(newTodo);
      saveTodos();
      renderTodos();
      todoInput.value = '';
  });
}

function clearTodos(): void {
  todos = [];
  saveTodos();
  renderTodos();
}

clearListButton.addEventListener("click", clearTodos);

async function saveTodos(): Promise<void> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return;
  }
  if (!user) return;

  try {
    await supabase.from("todos").delete().eq("user_id", user.id);
    if (todos.length > 0) {
      await supabase.from("todos").insert(todos.map(todo => ({ ...todo, user_id: user.id })));
    }
  } catch (saveError) {
    console.error("Could not save todos to Supabase", saveError);
  }
}


function renderTodos(): void {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
    });

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "❌";

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

checkAuth(); 
