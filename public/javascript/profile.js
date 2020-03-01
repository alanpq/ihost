/**
 * @function {import('popup.js').openPopup} openPopup
 */
const deleteAccount = () => {
  openPopup("Woah", `Are you sure you want to delete your account? To confirm, please enter <pre>${user.name}</pre>`, "enter confirmation text here", "Delete", "Cancel", (txt, buttonid, close) => {
    if(buttonid == 1) return close()
    if(txt == user.name) {
      postData(`../api/users/${user.name}/delete`, {sure: true}).then((data) => {
        if(data.code == 200) {
          window.location = '/logout'
        }
        console.log(data)
      }).catch(e => {console.error(e)})
    }
  })
}