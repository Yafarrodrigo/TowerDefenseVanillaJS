import Game from "./Classes/Game.js"
import Tower from "./Classes/Tower.js"


const game = new Game()
game.map.create()

game.graphics.createBg()
game.graphics.createRoad()

game.startClock()

// CREAR TORRES
game.graphics.bgCanvas.addEventListener("click", (e)=>{

    const XY = getMousePos(game.graphics.bgCanvas, e)
    const type = document.querySelector("input[name='towerType']:checked").id

        // CREATE
    if(game.map.tiles[XY.x][XY.y].road === false &&
        game.map.tiles[XY.x][XY.y].tower === false &&
        game.player.checkIfMoney(true, type)) {

        let newTower = new Tower(game, XY.x, XY.y , type)
        game.activeTowers.push(newTower)
        newTower.create()

        // UPGRADE
    }else{
        
        if(game.map.tiles[XY.x][XY.y].tower === true && game.activeTowers.length !== 0){
            game.activeTowers.forEach((tower)=>{
                if(Math.floor(tower.x/50) === XY.x && Math.floor(tower.y/50) === XY.y){
                    game.infoPanel.updateTowerInfo(tower)
                    game.towerSelected = tower
                }
            })
            game.graphics.updateTowers()
        }
    }
})

game.graphics.bgCanvas.addEventListener("mousemove", (e)=>{
    e.preventDefault()
    e.stopPropagation()

    const XY = getMousePos(game.graphics.bgCanvas, e)
    game.activeTowers.forEach((tower)=>{
        tower.showRadius = false
            if(game.map.tiles[XY.x][XY.y].tower === true && game.activeTowers.length !== 0){
                if(Math.floor(tower.x/50) === XY.x && Math.floor(tower.y/50) === XY.y){
                    tower.showRadius = true
                }
            }
        })

})

document.addEventListener("keyup", (e)=>{
    e.preventDefault()
    e.stopPropagation()
    if(e.code  === "Space"){
        if(game.stopped === true){
            game.stopped = false
            game.startClock()
        }else{
            game.stopped = true
            game.stopClock()
        }
    }
})

//////// MOUSE X,Y
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((evt.clientX - rect.left)/50),
        y: Math.floor((evt.clientY - rect.top)/50)
    };
}

