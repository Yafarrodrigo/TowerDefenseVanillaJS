import _TOWERS from "../towersConfig.js"

export default class Graphics{
    canvas = document.getElementById("canvas")
    ctx = this.canvas.getContext("2d")

    extraCanvas = document.getElementById("extra-canvas")
    extraCtx = this.extraCanvas.getContext("2d")

    floorTile = new Image()
    openFloorTile = new Image()
    turretTile = new Image()
    

    constructor(game){
        this.game = game
        this.floorTile.src = "../Assets/floorTile.jpg"
        this.openFloorTile.src = "../Assets/openFloorTile.jpg"
        this.turretTile.src = "../Assets/turret.png"
    }

    changeTile(x, y, type){

        this.game.map.tiles[x][y].type = type
        if(type === "floor"){
            this.ctx.drawImage(this.floorTile,x*50,y*50)
        }
        else if(type === "laser"){
            this.ctx.drawImage(this.openFloorTile,x*50,y*50)
        }
        else if(type === "slow"){
            this.ctx.drawImage(this.openFloorTile,x*50,y*50)
        }
        else if(type === "projectiles"){
            this.ctx.drawImage(this.openFloorTile,x*50,y*50)
        }
        else if(type === "aoe"){
            this.ctx.drawImage(this.openFloorTile,x*50,y*50)
        }
    }

    drawBg(){
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0,0,800,600)

        for(let x = 0; x < 16; x++){
            for(let y = 0; y < 12; y++){
                if(this.game.map.tiles[x][y].tower !== true){
                    this.changeTile(x,y,"floor")
                }else{
                    this.changeTile(x,y, this.game.map.tiles[x][y].type)
                }
            }
        }
    }
    
    drawRoad(){
        this.ctx.fillStyle = "#333"
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

    updateTowers(){
        if(this.game.activeTowers.length !== 0){
            this.game.activeTowers.forEach((tower)=>{

                this.ctx.fillStyle = "black"
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
                if(tower.target !== null && tower.target !== undefined && tower.projectiles === false){
                    this.extraCtx.beginPath();
                    this.extraCtx.lineWidth = 1
                    this.extraCtx.setLineDash([]);
                    if(tower.type === "slow") {this.extraCtx.strokeStyle = "lightblue"; this.extraCtx.lineWidth = 5}
                    else this.extraCtx.strokeStyle = "gold"
                    this.extraCtx.beginPath();
                    this.extraCtx.moveTo(tower.x, tower.y);
                    this.extraCtx.lineTo(tower.target.x+12, tower.target.y+12);
                    this.extraCtx.stroke();
                }

                // turrets
                this.extraCtx.save();
                this.extraCtx.translate(tower.x,tower.y);
                this.extraCtx.rotate(tower.turretAngle)
                this.extraCtx.translate(-tower.x, -tower.y); 
                this.extraCtx.drawImage(this.turretTile, tower.x-25, tower.y-25)
                this.extraCtx.restore();

            })
        }

        if(this.game.placingTower === true && this.game.map.tiles[this.game.cursorAt.x][this.game.cursorAt.y].road === false){
            this.ctx.fillStyle = "lightblue"
            this.ctx.fillRect(this.game.cursorAt.x*50,this.game.cursorAt.y*50,50,50)
        }
    }

    lostGame(){
        this.extraCtx.clearRect(0, 0, this.extraCanvas.width, this.extraCanvas.height);
        this.extraCtx.fillStyle = "darkred"
        this.extraCtx.fillRect(100,100,600,400)

        this.extraCtx.fillStyle = "white"
        this.extraCtx.font = "65px Comic Sans MS";
        this.extraCtx.textAlign = "center";
        
        this.extraCtx.fillText("YOU LOST", this.extraCanvas.width/2, (this.extraCanvas.height/2) -75);
        this.extraCtx.fillText("play again?", this.extraCanvas.width/2 - 100 , (this.extraCanvas.height/2) + 50);

        this.extraCtx.fillStyle = "white"
        this.extraCtx.fillRect(500,307, 100,50)

        this.extraCtx.font = "35px Arial";
        this.extraCtx.fillStyle = "black"
        this.extraCtx.fillText("Go !", 550, 345);
    }

    updateButtons(){

        if(!this.game.levelStarted){
            if(this.game.infoPanel.startButton.classList.contains("disabledButton")){
                this.game.infoPanel.startButton.classList.remove("disabledButton")
            }
        }
        else{
            if(!this.game.infoPanel.startButton.classList.contains("disabledButton")){
                this.game.infoPanel.startButton.classList.add("disabledButton")
            }
        }


        if(this.game.towerSelected !== null && this.game.towerSelected.level < 10){
            if(this.game.infoPanel.upgradeButton.classList.contains("disabledButton")){
                this.game.infoPanel.upgradeButton.classList.remove("disabledButton")
            }
            if(this.game.infoPanel.sellButton.classList.contains("disabledButton")){
                this.game.infoPanel.sellButton.classList.remove("disabledButton")
            }
        }
        else if (this.game.towerSelected !== null && this.game.towerSelected.level >= 10){

            if(!this.game.infoPanel.upgradeButton.classList.contains("disabledButton")){
                this.game.infoPanel.upgradeButton.classList.add("disabledButton")
            }

            if(this.game.infoPanel.sellButton.classList.contains("disabledButton")){
                this.game.infoPanel.sellButton.classList.remove("disabledButton")
            }
        }
        else{

            if(!this.game.infoPanel.upgradeButton.classList.contains("disabledButton")){
                this.game.infoPanel.upgradeButton.classList.add("disabledButton")
            }
            if(!this.game.infoPanel.sellButton.classList.contains("disabledButton")){
                this.game.infoPanel.sellButton.classList.add("disabledButton")
            }
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
        this.updateButtons()
    }

}