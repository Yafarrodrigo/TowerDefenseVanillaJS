import Game from "./Classes/Game.js"
import _PATHS from "./imgPaths.js"

const helpPages = [
    {number: 1, title:"Level Info", img: _PATHS.helpLevelInfo},
    {number: 2, title:"Lives and Credits", img: _PATHS.helpPlayerInfo},
    {number: 3, title:"Speed Control", img: _PATHS.helpSpeed},
    {number: 4, title:"Options", img: _PATHS.helpOptions},
    {number: 5, title:"Tower Stats", img: _PATHS.helpStats},
    {number: 6, title:"Upgrading & Selling Towers", img: _PATHS.helpUpgradeSell},
    {number: 7, title:"Brief towers description", img: _PATHS.helpTowers1},
    {number: 8, title:"Brief towers description", img: _PATHS.helpTowers2},
]
let currentPage = 1
const maxPage = helpPages.length
document.getElementById("helpPagination").innerText = currentPage + " / " + maxPage

document.getElementById("helpButtonBack").addEventListener("click", (e) => {
    (currentPage - 1) > 0 ? currentPage -= 1 : currentPage = 1
    document.getElementById("helpPagination").innerText = currentPage + " / " + maxPage
    document.getElementById("helpPageTitle").innerText = helpPages[currentPage-1].title
    document.getElementById("helpImage").src = helpPages[currentPage-1].img
})

document.getElementById("helpButtonNext").addEventListener("click", (e) => {
    (currentPage + 1) <= maxPage ? currentPage += 1 : currentPage = maxPage
    document.getElementById("helpPagination").innerText = currentPage + " / " + maxPage
    document.getElementById("helpPageTitle").innerText = helpPages[currentPage-1].title
    document.getElementById("helpImage").src = helpPages[currentPage-1].img
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
