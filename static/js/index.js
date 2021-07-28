
let adminLogin = document.querySelector(".admin-login");
let studentLogin = document.querySelector(".student-login");

adminLogin.style.display = "none";

document.querySelector(".student-switch").addEventListener("click", function(){
  adminLogin.style.display = "none";
  studentLogin.style.display = "";
})

document.querySelector(".admin-switch").addEventListener("click", function(){
  studentLogin.style.display = "none";
  adminLogin.style.display = "";
})

document.getElementById("adminForm").addEventListener('submit', (e)=>{
  if(document.getElementById("adminPassword").value == ""){
    e.preventDefault();
  }
  else{
    sessionStorage.setItem("adminLoggedIn","true");
  } 
})

document.getElementById("studentForm").addEventListener('click', (e)=>{
  if((document.getElementById("studentId").value == "") || (document.getElementById("password").value == "")){
    e.preventDefault();
  } 
})