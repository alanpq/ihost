const regForm = document.getElementById('register')
const regBut = document.getElementById('submit')

regForm.oninput = () => {
  regForm.elements.password.setCustomValidity("")
}

const register = () => {
  regForm.elements.id.readonly = true
  regForm.elements.password.readonly = true
  regBut.innerHTML = `<div class="loader"></div>`
  postData('/register', {
    id: regForm.elements.id.value,
    password: regForm.elements.password.value,
    ajax: true
  }).then((data) => {
    console.log(data)
    if(data.code == 201) window.location = "/profile"
    else {
      regForm.elements.password.setCustomValidity(data.message)
      regForm.elements.password.reportValidity()
    }
    regForm.elements.id.readonly = false
    regForm.elements.password.readonly = false
    regBut.innerHTML = "Register"
  });
}