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

    if(game.map.tiles[XY.x][XY.y].road === false &&
        game.map.tiles[XY.x][XY.y].tower === false){

        game.graphics.changeTile(XY.x, XY.y, "blue")
        game.map.tiles[XY.x][XY.y].tower = true
        let newTower = new Tower(game, XY.x, XY.y ,"normal")
        game.activeTowers.push(newTower)
        game.graphics.updateTowers()
    }else{
        if(game.map.tiles[XY.x][XY.y].tower === true && game.activeTowers.length !== 0){
            game.activeTowers.forEach((tower)=>{
                if(Math.floor(tower.x/50) === XY.x && Math.floor(tower.y/50) === XY.y){
                    tower.upgrade()
                }
            })
            game.graphics.updateTowers()
        }
    }

    
})

/* document.addEventListener("keyup", (e)=>{
    e.preventDefault()
    e.stopPropagation()
    if(e.code  === "Space"){
        game.stopClock()
        game.activeEnemies.forEach((enemy)=>{
            enemy.spawned = true
            enemy.dead = true
        })
        game.nextLevel()
        game.startClock()
    }
}) */

//////// MOUSE X,Y
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((evt.clientX - rect.left)/50),
        y: Math.floor((evt.clientY - rect.top)/50)
    };
}

