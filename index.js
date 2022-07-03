import Game from "./Classes/Game.js"

document.addEventListener("click", selectMapAndPlay)

function selectMapAndPlay(e){
    document.getElementById("levelSelectDiv").style.visibility = "hidden"
    document.getElementById("container").style.visibility = "visible"
    if(e.target.classList.contains("roadImg")){
        const game = new Game({roadNumber:e.target.id})
        game.setupAndStartGame()
    }
}
