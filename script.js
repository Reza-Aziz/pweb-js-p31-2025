// Login Page
let userData = [];
async function fetchData() {
	const response = await fetch("https://dummyjson.com/users");
	const data = await response.json();
    userData = data.users;
	console.log(userData);
}

function data_checker(){
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const user = userData.find(u => u.username == username && u.password == password)
    if (user){
        console.log("success")
        window.location.href = "loading_state.html";
    }else{
        console.log("wrong input")
    }
}

fetchData();
document.querySelector("button").addEventListener("click", function(e) {
  e.preventDefault(); 
  data_checker();
});
