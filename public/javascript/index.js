const testOut = document.getElementById('testout')

const testpop = () => {
    openPopup("Popup!", "this is a test popup", "put something in me :)", "cool", "no thanks", (txt, button, close) => {
        testOut.innerText = `you put '${txt}' in me :) (button ${button})`
        close()
    })
}