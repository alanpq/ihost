const elems = {}
elems.popup   = document.getElementById('popup')
elems.form    = elems.popup.children[0]
elems.title   = elems.form.children[0]
elems.message = elems.form.children[1]
elems.choice  = {
    root: document.getElementById('choice')
}
elems.choice.one = elems.choice.root.children[0]
elems.choice.two = elems.choice.root.children[1]

elems.text = document.getElementById('text').children[0]

//TODO: replace popup callback with a Promise
var popupCallback = undefined;

/**
 * @function openPopup Open a popup with specific title, message, etc.
 * @param {String} title Popup Title
 * @param {String} msg Popup Message
 * @param {String} text Placeholder for input box (empty for no input box)
 * @param {String} butOne Text for button 1 (empty for no button)
 * @param {String} butTwo Text for button 2 (empty for no button)
 * @param {function} cb Callback when popup submitted (text val, button id, close cb)
 */
const openPopup = (title, msg="", text="", butOne="Yes", butTwo="No", cb=undefined) => {
    popupCallback = cb
    elems.title.innerText   = title
    elems.message.innerHTML = msg // TODO: see how using innerHTML completely cripples the site with code injection attacks

    elems.choice.one.style.visibility = butOne ? "visible" : "hidden"
    elems.choice.one.value = butOne

    elems.choice.two.style.visibility = butTwo ? "visible" : "hidden"
    elems.choice.two.value = butTwo

    elems.text.placeholder = text
    elems.popup.className = "active"
}

const popupAction = (buttonID) => {
    if(popupCallback) {
        popupCallback(elems.text.value, buttonID, closePopup)
    } else {
        closePopup()
    }
}

const closePopup = () => {
    elems.popup.className = ""
}