import { signUp, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { fetchTodos } from './main';

const authContainer = document.getElementById("auth-container") as HTMLDivElement;
const todoContainer = document.getElementById("todo-container") as HTMLDivElement;
const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;
const authForm = document.getElementById("auth-form") as HTMLFormElement;
const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
const signOutBtn = document.getElementById("sign-out") as HTMLButtonElement;

export async function checkAuth() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error checking auth:", error);
      throw error;
    }
    const user = data.user;
    if (user) {
      authContainer.style.display = "none";
      todoContainer.style.display = "block";
      await fetchTodos(); // Fetch todos after checking authentication
    } else {
      authContainer.style.display = "block";
      todoContainer.style.display = "none";
    }
  } catch (error) {
    console.error("Error checking auth:", error);
    authContainer.style.display = "block";
    todoContainer.style.display = "none";
  }
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    await signUp(email, password);
    alert("Sign-up successful! Please log in.");
  } catch (error) {
    errorMessage.textContent = (error as Error).message;
  }
});

loginBtn.addEventListener("click", async () => {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    await signIn(email, password);
    await checkAuth();
  } catch (error) {
    errorMessage.textContent = (error as Error).message;
  }
});

signOutBtn.addEventListener("click", async () => {
  try {
    await signOut();
    console.log("User signed out");
    checkAuth();
  } catch (error) {
    console.error("Error signing out:", error);
  }
});