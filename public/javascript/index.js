const testOut = document.getElementById('testout')

const testpop = () => {
    openPopup("Popup!", "this is a test popup", "put something in me :)", "cool", "no thanks", (txt, button, close) => {
        testOut.innerText = `you put '${txt}' in me :) (button ${button})`
        close()
    })
}

/* <li><span>entry 1</span><button onclick="remove(1)">remove</button></li> */

const dom_list = document.getElementById("list")
const dom_input = document.getElementById("addInp")
const dom_output = document.getElementById("output")
var items = []
const drawList = () => {
    let txt = ""
    let i = 0
    items.sort((a,b) => {
        const aa = a.split(" ").slice(1).join(" ")
        const bb = b.split(" ").slice(1).join(" ")
        return aa.localeCompare(bb)
    })
    items.forEach(item => {
        txt += `<li><span>${item}</span><button onclick="remove(${i})">-</button></li>`
        i++
    });
    dom_output.innerHTML = items.join("&#13;")
}

const remove = i => {
    items.splice(i,1)
    drawList()
}

const pushList = () => {
    items.push(dom_input.value)
    dom_input.value = ""
    drawList()
}