import Game from "./Classes/Game.js"
import roads from "./roads.js"
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
    const lvlSelectDiv = document.getElementById('levelSelectDiv')
    document.getElementById("mainMenu").classList.remove("shown")
    document.getElementById("mainMenu").classList.add("notShown")
    lvlSelectDiv.classList.remove("notShown")
    lvlSelectDiv.classList.add("shown")
    document.getElementById("levelSelectH1").classList.remove("notShown")
    document.getElementById("levelSelectH1").classList.add("shown")

    roads.forEach( (road,index) => {
        const newRoad = document.createElement('canvas')
        newRoad.classList.add('roadImg')
        newRoad.id = index
        newRoad.width = 400
        newRoad.height = 300
        const ctx = newRoad.getContext('2d')
        lvlSelectDiv.append(newRoad)

        ctx.fillStyle = "#222"
        ctx.fillRect(0,0,400,300)

        displayRoad(ctx, road)
    })
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

function displayRoad(ctx,road){

    const {width,height} = ctx.canvas

    const qtyTilesX = 16
    const qtyTilesY = 12

    const floorTile = new Image()
    const roadFloor = new Image()
    floorTile.src = _PATHS.floor
    roadFloor.src = _PATHS.roadFloor

    const tileSizeX = Math.round(width / qtyTilesX)
    const tileSizeY = Math.round(height / qtyTilesY)

    for(let x = 0; x < qtyTilesX; x++){
        for(let y = 0; y < qtyTilesY; y++){
            ctx.strokeStyle = "black"
            ctx.strokeRect(x*tileSizeX,y*tileSizeY,tileSizeX,tileSizeY)
        }
    }

    
    // FIRST TILE
    ctx.fillStyle = "green"
    ctx.fillRect(road[0][0] * tileSizeX,road[0][1] * tileSizeY,tileSizeX,tileSizeY)

    ctx.fillStyle = "#555"
    
    for(let i = 0; i < road.length-1; i++){
        let firstPoint = road[i]
        let secondPoint = road[i+1]

        // VERTICAL
        if(firstPoint[0] === secondPoint[0]){
            if(secondPoint[1] >= firstPoint[1]){
                for(let j = 1; j <= Math.abs(secondPoint[1]-firstPoint[1]); j++){
                    ctx.fillRect((firstPoint[0] * tileSizeX),(firstPoint[1] * tileSizeX) + j * tileSizeY,tileSizeX,tileSizeY)
                }
            }else{
                for(let j = Math.abs(secondPoint[1]-firstPoint[1]); j > 0 ; j--){
                    ctx.fillRect((firstPoint[0] * tileSizeX),(firstPoint[1] * tileSizeX) - j * tileSizeY,tileSizeX,tileSizeY)
                }
            }
        }
        // HORIZONTAL
        else if (firstPoint[1] === secondPoint[1]){
            if(secondPoint[0] >= firstPoint[0]){
                for(let j = 1; j <= Math.abs(secondPoint[0]-firstPoint[0]); j++){
                    ctx.fillRect((firstPoint[0] * tileSizeX) + j * tileSizeX,(firstPoint[1] * tileSizeY),tileSizeX,tileSizeY)
                }
            }else{
                for(let j = Math.abs(secondPoint[0]-firstPoint[0]); j > 0 ; j--){
                    ctx.fillRect((firstPoint[0] * tileSizeX)- j * tileSizeX,(firstPoint[1] * tileSizeY),tileSizeX,tileSizeY)
                }
            }
        }
    }

    // LAST TILE
    ctx.fillStyle = "red"
    ctx.fillRect(road[road.length-1][0] * tileSizeX,road[road.length-1][1] * tileSizeY,tileSizeX,tileSizeY)
}
