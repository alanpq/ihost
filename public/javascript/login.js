const loginForm = document.getElementById('login')
const loginBut = document.getElementById('submit')

loginForm.oninput = () => {
  loginForm.elements.password.setCustomValidity("")
}

const login = () => {
  loginForm.elements.id.readonly = true
  loginForm.elements.password.readonly = true
  loginBut.innerHTML = `<div class="loader"></div>`
  postData('/login', {
    id: loginForm.elements.id.value,
    password: loginForm.elements.password.value,
    ajax: true
  }).then((data) => {
    if(data.code == 200) window.location = "/profile"
    else {
      loginForm.elements.password.setCustomValidity(data.message)
      loginForm.elements.password.reportValidity()
    }
    loginForm.elements.id.readonly = false
    loginForm.elements.password.readonly = false
    loginBut.innerHTML = "Login"
    console.log(data); // JSON data parsed by `response.json()` call
  });
}