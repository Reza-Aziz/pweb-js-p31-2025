interface User {
  username: string;
  password: string;
}

interface ApiResponse {
  users: User[];
}

let userData: User[] = [];

async function fetchData(): Promise<void> {
  const response = await fetch("https://dummyjson.com/users");
  const data: ApiResponse = await response.json();
  userData = data.users;
}

function checkLogin(): void {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  
  const user = userData.find(u => u.username === username && u.password === password);
  
  if (user) {
    window.location.href = "loading_state.html";
  } else {
    alert("Username atau password salah!");
  }
}

fetchData();

document.querySelector("button")?.addEventListener("click", (e) => {
  e.preventDefault();
  checkLogin();
});