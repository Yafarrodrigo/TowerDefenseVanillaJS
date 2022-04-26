export default class Graphics{
    bgCanvas = document.getElementById("bg-canvas")
    bgCtx = this.bgCanvas.getContext("2d")

    enemyCanvas = document.getElementById("enemies-canvas")
    enemyCtx = this.enemyCanvas.getContext("2d")

    fxCanvas = document.getElementById("fx-canvas")
    fxCtx = this.fxCanvas.getContext("2d")

    constructor(game){
        this.game = game
    }

    changeTile(x, y, color){
        this.bgCtx.fillStyle = color
        if(color === "white"){this.tiles[x][y].isRoad = true}
        this.game.map.tiles[x][y].color = color
        this.bgCtx.fillRect((x*50)+1,(y*50)+1,49,49)
    }

    createBg(){
        this.bgCtx.fillStyle = "black"
        this.bgCtx.fillRect(0,0,800,600)

        for(let x = 0; x < 16; x++){
            for(let y = 0; y < 12; y++){
                this.changeTile(x,y,"grey")
            }
        }
    }
    
    createRoad(){
        this.bgCtx.fillStyle = "white"
        for(let i = 0; i < this.game.map.road.length-1; i++){
            let firstPoint = this.game.map.road[i]
            let secondPoint = this.game.map.road[i+1]

            // VERTICAL
            if(firstPoint[0] === secondPoint[0]){
                if(secondPoint[1] >= firstPoint[1]){
                    this.bgCtx.fillRect(
                        (firstPoint[0]*50),
                        (firstPoint[1]*50),
                        49,
                        (Math.abs(firstPoint[1]-secondPoint[1]))*50)
                }else{
                    this.bgCtx.fillRect(
                        (secondPoint[0]*50),
                        (secondPoint[1]*50)- 50 * (secondPoint[1]-firstPoint[1]),
                        49, 
                        (secondPoint[1]-firstPoint[1])*50)
                }
            }
            // HORIZONTAL
            else if (firstPoint[1] === secondPoint[1]){
                if(secondPoint[0] >= firstPoint[0]){
                    this.bgCtx.fillRect(
                        (firstPoint[0]*50),
                        (firstPoint[1]*50),
                        (Math.abs(firstPoint[0]-secondPoint[0]))*50 +49,
                        49)
                }else{
                    this.bgCtx.fillRect(
                        (secondPoint[0]*50),
                        (secondPoint[1]*50),
                        Math.abs(secondPoint[0]-firstPoint[0])*50+49,
                        49)
                }
            }
            else {console.log("error");}
        }

        // LAST TILE
        this.bgCtx.fillRect(
            this.game.map.road[this.game.map.road.length-1][0] * 50,
            this.game.map.road[this.game.map.road.length-1][1] * 50,
            49,
            49
        )
    }

    displayEnemies(){

        this.enemyCtx.clearRect(0, 0, this.enemyCanvas.width, this.enemyCanvas.height);

        let enemies = this.game.activeEnemies

        for(let i = 0; i < enemies.length; i++){
            if(enemies[i].dead === false && enemies[i].spawned === true){

                
                
                let healthPercent = Math.floor(enemies[i].health/enemies[i].maxHealth *100)
                if(healthPercent > 66){
                    this.enemyCtx.fillStyle = "green"
                }
                else if (healthPercent > 33){
                    this.enemyCtx.fillStyle = "orange"
                }
                else if (healthPercent <= 33){
                    this.enemyCtx.fillStyle = "red"
                }
                this.enemyCtx.fillRect(enemies[i].x -5, enemies[i].y-10,healthPercent*0.3, 5)

                this.enemyCtx.fillStyle = "purple"
                this.enemyCtx.fillRect(enemies[i].x, enemies[i].y, 20, 20)
            }
        }
    }

    //////////// TEST 
    updateTowers(){
        this.fxCtx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
        if(this.game.activeTowers.length !== 0){
            this.game.activeTowers.forEach((tower)=>{

                this.fxCtx.fillStyle = "lightgreen"
                this.fxCtx.fillRect(tower.x,tower.y,1,1)

                this.fxCtx.strokeStyle = "black"
                this.fxCtx.beginPath()
                this.fxCtx.arc(tower.x, tower.y, tower.range, 0, 2*Math.PI)
                this.fxCtx.stroke()

                if(this.game.activeEnemies[tower.target] !== null && this.game.activeEnemies[tower.target] !== undefined){
                    this.fxCtx.strokeStyle = "gold"
                    this.fxCtx.beginPath();
                    this.fxCtx.moveTo(tower.x, tower.y);
                    this.fxCtx.lineTo(this.game.activeEnemies[tower.target].x+12, this.game.activeEnemies[tower.target].y+12);
                    this.fxCtx.stroke();
                }
            })
        }
    }
}