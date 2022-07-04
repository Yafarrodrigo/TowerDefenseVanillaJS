import Game from "./Classes/Game.js"

document.addEventListener("click", (e)=>{
    if(e.target.classList.contains("roadImg")){
        selectMapAndPlay(e.target.id)
    }
})

function selectMapAndPlay(mapId){
    document.getElementById("levelSelectDiv").style.visibility = "hidden"
    document.getElementById("container").style.visibility = "visible"
    
    const game = new Game({roadNumber:mapId})
    game.setupAndStartGame()
}
