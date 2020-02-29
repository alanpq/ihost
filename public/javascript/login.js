const loginForm = document.getElementById('login')
const loginBut = document.getElementById('submit')

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

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