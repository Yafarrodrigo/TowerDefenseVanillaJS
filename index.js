import Game from "./Classes/Game.js"
import _PATHS from "./imgPaths.js"

const helpPages = [
    {number: 1,img: _PATHS.helpPlaceholder},
    {number: 2,img: _PATHS.helpPlaceholder},
    {number: 3,img: _PATHS.helpPlaceholder},
    {number: 4,img: _PATHS.helpPlaceholder},
    {number: 5,img: _PATHS.helpPlaceholder},
]
let currentPage = 1
const maxPage = helpPages.length
document.getElementById("helpPagination").innerText = currentPage + " / " + maxPage

document.getElementById("helpButtonBack").addEventListener("click", (e) => {
    (currentPage - 1) > 0 ? currentPage -= 1 : currentPage = 1
    document.getElementById("helpPagination").innerText = currentPage + " / " + maxPage
})

document.getElementById("helpButtonNext").addEventListener("click", (e) => {
    (currentPage + 1) <= maxPage ? currentPage += 1 : currentPage = maxPage
    document.getElementById("helpPagination").innerText = currentPage + " / " + maxPage
})


// LEVEL SELECT
document.addEventListener("click", (e)=>{
    if(e.target.classList.contains("roadImg")){
        selectMapAndPlay(e.target.id)
    }
})

// MAIN MENU PLAY BUTTON
document.getElementById("mainMenuPlayButton").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("mainMenu").classList.remove("shown")
    document.getElementById("mainMenu").classList.add("notShown")
    document.getElementById("levelSelectDiv").classList.remove("notShown")
    document.getElementById("levelSelectDiv").classList.add("shown")
    document.getElementById("levelSelectH1").classList.remove("notShown")
    document.getElementById("levelSelectH1").classList.add("shown")
})

function selectMapAndPlay(mapId){
    document.getElementById("levelSelectDiv").classList.remove("shown")
    document.getElementById("levelSelectDiv").classList.add("notShown")

    document.getElementById("container").classList.remove("notShown")
    document.getElementById("container").classList.add("shown")

    document.getElementById("levelSelectH1").classList.add("notShown")
    document.getElementById("levelSelectH1").classList.remove("shown")
    
    const game = new Game({roadNumber:mapId})
    game.setupAndStartGame()
}
