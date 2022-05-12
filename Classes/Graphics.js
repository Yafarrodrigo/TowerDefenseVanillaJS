export default class Graphics{
    canvas = document.getElementById("bg-canvas")
    ctx = this.canvas.getContext("2d")

    extraCanvas = document.getElementById("enemies-canvas")
    extraCtx = this.extraCanvas.getContext("2d")

    constructor(game){
        this.game = game
    }

    changeTile(x, y, color){
        this.ctx.fillStyle = color
        if(color === "white"){this.tiles[x][y].isRoad = true}
        this.game.map.tiles[x][y].color = color
        this.ctx.fillRect((x*50)+1,(y*50)+1,49,49)
    }

    drawBg(){
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0,0,800,600)

        for(let x = 0; x < 16; x++){
            for(let y = 0; y < 12; y++){
                if(this.game.map.tiles[x][y].tower !== true){
                    this.changeTile(x,y,"grey")
                }else{
                    this.changeTile(x,y, this.game.map.tiles[x][y].color)
                }
            }
        }
    }
    
    drawRoad(){
        this.ctx.fillStyle = "white"
        for(let i = 0; i < this.game.map.road.length-1; i++){
            let firstPoint = this.game.map.road[i]
            let secondPoint = this.game.map.road[i+1]

            // VERTICAL
            if(firstPoint[0] === secondPoint[0]){
                if(secondPoint[1] >= firstPoint[1]){
                    this.ctx.fillRect(
                        (firstPoint[0]*50),
                        (firstPoint[1]*50),
                        49,
                        (Math.abs(firstPoint[1]-secondPoint[1]))*50)
                }else{
                    this.ctx.fillRect(
                        (secondPoint[0]*50),
                        (secondPoint[1]*50)- 50 * (secondPoint[1]-firstPoint[1]),
                        49, 
                        (secondPoint[1]-firstPoint[1])*50)
                }
            }
            // HORIZONTAL
            else if (firstPoint[1] === secondPoint[1]){
                if(secondPoint[0] >= firstPoint[0]){
                    this.ctx.fillRect(
                        (firstPoint[0]*50),
                        (firstPoint[1]*50),
                        (Math.abs(firstPoint[0]-secondPoint[0]))*50 +49,
                        49)
                }else{
                    this.ctx.fillRect(
                        (secondPoint[0]*50),
                        (secondPoint[1]*50),
                        Math.abs(secondPoint[0]-firstPoint[0])*50+49,
                        49)
                }
            }
            else {console.log("error");}
        }

        // LAST TILE
        this.ctx.fillRect(
            this.game.map.road[this.game.map.road.length-1][0] * 50,
            this.game.map.road[this.game.map.road.length-1][1] * 50,
            49,
            49
        )
    }

    displayEnemies(){

        //this.ctx.clearRect(0, 0, this.enemyCanvas.width, this.enemyCanvas.height);

        let enemies = this.game.activeEnemies

        for(let i = 0; i < enemies.length; i++){
            if(enemies[i].dead === false && enemies[i].spawned === true){

                
                
                let healthPercent = Math.floor(enemies[i].health/enemies[i].maxHealth *100)
                if(healthPercent > 66){
                    this.ctx.fillStyle = "green"
                }
                else if (healthPercent > 33){
                    this.ctx.fillStyle = "orange"
                }
                else if (healthPercent <= 33){
                    this.ctx.fillStyle = "red"
                }
                this.ctx.fillRect(enemies[i].x -5, enemies[i].y-10,healthPercent*0.3, 5)

                this.ctx.fillStyle = "purple"
                this.ctx.fillRect(enemies[i].x, enemies[i].y, 20, 20)
            }
        }
    }

    displayBullets(){
        if(this.game.activeBullets.length !== 0){
            this.game.activeBullets.forEach((bullet)=>{
                this.ctx.fillStyle = "red"
                this.ctx.fillRect(bullet.x,bullet.y,5,5)
            })
        }
    }

    //////////// TEST 
    updateTowers(){
        //this.fxCtx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
        if(this.game.activeTowers.length !== 0){
            this.game.activeTowers.forEach((tower)=>{

                this.ctx.fillStyle = "lightgreen"
                this.ctx.fillRect(tower.x,tower.y,1,1)

                if(tower.showRadius === true || this.game.infoPanel.showRadiusCheckbox.checked){

                    // selected tower
                    if(this.game.towerSelected !== null && this.game.towerSelected.id === tower.id){
                        this.extraCtx.beginPath();
                        this.extraCtx.lineWidth = 2
                        this.extraCtx.setLineDash([10, 10]);
                        this.extraCtx.strokeStyle = "red"    
                    }else{
                        this.extraCtx.beginPath();
                        this.extraCtx.lineWidth = 0.5
                        this.extraCtx.setLineDash([]);
                        this.extraCtx.strokeStyle = "black"
                    }

                    // range
                    this.extraCtx.beginPath()
                    this.extraCtx.arc(tower.x, tower.y, tower.range, 0, 2*Math.PI)
                    this.extraCtx.stroke()
                }

                // attacks
                if(this.game.activeEnemies[tower.target] !== null && this.game.activeEnemies[tower.target] !== undefined && tower.type !== "projectiles" && tower.type !== "aoe"){
                    this.extraCtx.beginPath();
                    this.extraCtx.lineWidth = 1
                    this.extraCtx.setLineDash([]);
                    this.extraCtx.strokeStyle = "gold"
                    this.extraCtx.beginPath();
                    this.extraCtx.moveTo(tower.x, tower.y);
                    this.extraCtx.lineTo(this.game.activeEnemies[tower.target].x+12, this.game.activeEnemies[tower.target].y+12);
                    this.extraCtx.stroke();
                }
            })
        }

        if(this.game.placingTower === true && this.game.map.tiles[this.game.cursorAt.x][this.game.cursorAt.y].road === false){
            this.ctx.fillStyle = "yellow"
            this.ctx.fillRect(this.game.cursorAt.x*50,this.game.cursorAt.y*50,50,50)
        }
    }

    update(){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.extraCtx.clearRect(0, 0, this.extraCanvas.width, this.extraCanvas.height);

        this.drawBg()
        this.drawRoad()
        this.displayEnemies()
        this.displayBullets()
        this.updateTowers()
    }

}