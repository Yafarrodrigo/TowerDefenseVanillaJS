import _TOWERS from "../towersConfig.js"
import _PATHS from "../imgPaths.js"

export default class Graphics{
    canvas = document.getElementById("canvas")
    ctx = this.canvas.getContext("2d")

    extraCanvas = document.getElementById("extra-canvas")
    extraCtx = this.extraCanvas.getContext("2d")

    floorTile = new Image()
    roadFloor = new Image()
    openFloorTile = new Image()
    laserTurretTile = new Image()
    chainLaserTurretTile = new Image()
    slowTurretTile = new Image()
    stopTurretTile = new Image()
    aoeTurretTile = new Image()
    sniperTurretTile = new Image()
    boostDamageTile = new Image()
    boostRangeTile = new Image()
    
    enemy = new Image()

    constructor(game){
        this.game = game
        this.floorTile.src = _PATHS.floor
        this.roadFloor.src = _PATHS.roadFloor
        this.openFloorTile.src = _PATHS.openFloor
        this.laserTurretTile.src = _PATHS.laserTower
        this.chainLaserTurretTile.src = _PATHS.chainLaserTower
        this.slowTurretTile.src = _PATHS.slowTower
        this.stopTurretTile.src = _PATHS.stopTower
        this.aoeTurretTile.src = _PATHS.aoeTower
        this.sniperTurretTile.src = _PATHS.sniperTower
        this.boostDamageTile.src = _PATHS.boostDamageTower
        this.boostRangeTile.src = _PATHS.boostRangeTower
        this.enemy.src = _PATHS.enemy
        
    }

    changeTile(x, y, type){

        this.game.map.tiles[x][y].type = type
        if(type === "floor"){
            this.ctx.drawImage(this.floorTile, x * this.game.map.tileSize, y * this.game.map.tileSize, this.game.map.tileSize, this.game.map.tileSize)
        }
        else if(type === "boostDamage"){
            this.ctx.drawImage(this.boostDamageTile, x * this.game.map.tileSize, y * this.game.map.tileSize)
        }
        else if(type === "boostRange"){
            this.ctx.drawImage(this.boostRangeTile, x * this.game.map.tileSize, y * this.game.map.tileSize)
        }
        else{
            this.ctx.drawImage(this.floorTile, x * this.game.map.tileSize, y * this.game.map.tileSize, this.game.map.tileSize, this.game.map.tileSize)
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

        // FIRST TILE
        this.ctx.drawImage(
            this.roadFloor,
            this.game.map.road[0][0] *  this.game.map.tileSize,
            this.game.map.road[0][1] *  this.game.map.tileSize,
            this.game.map.tileSize,
            this.game.map.tileSize)

        for(let i = 0; i < this.game.map.road.length-1; i++){
            let firstPoint = this.game.map.road[i]
            let secondPoint = this.game.map.road[i+1]

            // VERTICAL
            if(firstPoint[0] === secondPoint[0]){
                if(secondPoint[1] >= firstPoint[1]){
                    for(let j = 1; j <= Math.abs(secondPoint[1]-firstPoint[1]); j++){
                        this.ctx.drawImage(
                            this.roadFloor,
                            (firstPoint[0] * this.game.map.tileSize),
                            (firstPoint[1] * this.game.map.tileSize) + j * this.game.map.tileSize,
                            this.game.map.tileSize,
                            this.game.map.tileSize)
                    }
                }else{
                    for(let j = Math.abs(secondPoint[1]-firstPoint[1]); j > 0 ; j--){
                        this.ctx.drawImage(
                            this.roadFloor,
                            (firstPoint[0] * this.game.map.tileSize),
                            (firstPoint[1] * this.game.map.tileSize) - j * this.game.map.tileSize,
                            this.game.map.tileSize,
                            this.game.map.tileSize)
                    }
                }
            }
            // HORIZONTAL
            else if (firstPoint[1] === secondPoint[1]){
                if(secondPoint[0] >= firstPoint[0]){
                    for(let j = 1; j <= Math.abs(secondPoint[0]-firstPoint[0]); j++){
                        this.ctx.drawImage(
                            this.roadFloor,
                            (firstPoint[0] * this.game.map.tileSize) + j * this.game.map.tileSize,
                            (firstPoint[1] * this.game.map.tileSize),
                            this.game.map.tileSize,
                            this.game.map.tileSize)
                    }
                }else{
                    for(let j = Math.abs(secondPoint[0]-firstPoint[0]); j > 0 ; j--){
                        this.ctx.drawImage(
                            this.roadFloor,
                            (firstPoint[0] * this.game.map.tileSize)- j * this.game.map.tileSize,
                            (firstPoint[1] * this.game.map.tileSize),
                            this.game.map.tileSize,
                            this.game.map.tileSize)
                    }
                 }
            }
           
            else {console.log("error in graphics!");}
        }

        // LAST TILE
        this.ctx.drawImage(
            this.roadFloor,
            this.game.map.road[this.game.map.road.length-1][0] *  this.game.map.tileSize,
            this.game.map.road[this.game.map.road.length-1][1] *  this.game.map.tileSize,
            this.game.map.tileSize,
            this.game.map.tileSize)
    }

    displayEnemies(){

        let enemies = this.game.activeEnemies

        for(let i = enemies.length-1; i >= 0; i--){
            if(enemies[i].dead === false && enemies[i].spawned === true){
    
                let healthPercent = Math.floor(enemies[i].health/enemies[i].maxHealth *100)
                if(healthPercent > 66){
                    this.ctx.fillStyle = "green"
                }
                else if (healthPercent > 33){
                    this.ctx.fillStyle = "orange"
                }
                else{
                    this.ctx.fillStyle = "red"
                }

                this.ctx.fillRect(enemies[i].x -1, enemies[i].y-10,healthPercent*0.3, 5)

                this.ctx.save()
                this.ctx.translate(enemies[i].x+15, enemies[i].y+15)
                
                if(enemies[i].direction === "up"){
                    this.ctx.rotate(-Math.PI/2)
                }else if(enemies[i].direction === "down"){
                    this.ctx.rotate(Math.PI/2)
                }else if(enemies[i].direction === "left"){
                    this.ctx.rotate(Math.PI)
                }
                this.ctx.translate(-enemies[i].x-15, -enemies[i].y-15)
                this.animateEnemy(enemies[i])
                this.ctx.restore()
            }
        }
    }

    animateEnemy(enemy){
        const s = enemy.animationStep
        this.ctx.drawImage(this.enemy,0+(50*s),0,50,50,enemy.x, enemy.y, 30, 30)
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

                if(this.game.infoPanel.showRadiusCheckbox.checked){

                    // selected tower
                    if(this.game.towerSelected !== null && this.game.towerSelected.id === tower.id){
                        this.extraCtx.beginPath();
                        this.extraCtx.lineWidth = 2
                        this.extraCtx.setLineDash([10, 10]);
                        this.extraCtx.strokeStyle = "red"  
                        this.extraCtx.fillStyle = "rgba(255,0,0,0.15)"
                    }else{
                        this.extraCtx.beginPath();
                        this.extraCtx.lineWidth = 0.5
                        this.extraCtx.setLineDash([]);
                        this.extraCtx.strokeStyle = "green"
                        this.extraCtx.fillStyle = "rgba(0,255,0,0)"
                    }

                    // range
                    this.extraCtx.beginPath()
                    this.extraCtx.arc(tower.x, tower.y, tower.finalRange, 0, 2*Math.PI)
                    this.extraCtx.fill()
                    this.extraCtx.stroke()
                }
                else{
                    // checkbox desactivado
                    if(this.game.towerSelected !== null && this.game.towerSelected.id === tower.id){
                        this.extraCtx.beginPath();
                        this.extraCtx.lineWidth = 2
                        this.extraCtx.setLineDash([10, 10]);
                        this.extraCtx.strokeStyle = "red" 
                        this.extraCtx.fillStyle = "rgba(255,0,0,0.15)"

                         // range
                        this.extraCtx.beginPath()
                        this.extraCtx.arc(tower.x, tower.y, tower.finalRange, 0, 2*Math.PI)
                        this.extraCtx.fill()
                        this.extraCtx.stroke()
                    }
                    else if(tower.showRadius === true){
                            this.extraCtx.beginPath();
                            this.extraCtx.lineWidth = 0.5
                            this.extraCtx.setLineDash([]);
                            this.extraCtx.strokeStyle = "green"
                            this.extraCtx.fillStyle = "rgba(0,255,0,0.15)"
                            this.extraCtx.beginPath()
                            this.extraCtx.arc(tower.x, tower.y, tower.finalRange, 0, 2*Math.PI)
                            this.extraCtx.fill()
                            this.extraCtx.stroke()
                    }
                }

                

                // attacks
                if(tower.target !== null && tower.target !== undefined && tower.projectiles === false && 
                    tower.type !== "slow" && tower.type !== "boostDamage"){

                    this.extraCtx.beginPath();
                    if(tower.type === "stop"){
                        this.extraCtx.strokeStyle = "lightblue"
                        this.extraCtx.lineWidth = 3
                    }
                    else{
                        this.extraCtx.strokeStyle = "gold"
                        this.extraCtx.lineWidth = 1
                    }    
                    this.extraCtx.setLineDash([]);
                    this.extraCtx.beginPath();
                    this.extraCtx.moveTo(tower.x, tower.y);
                    this.extraCtx.lineTo(tower.target.x+12, tower.target.y+12);
                    this.extraCtx.stroke();
                }
                if(tower.type === "chainLaser" && this.game.activeEnemies.length >= 3){
                    this.extraCtx.beginPath();
                    this.extraCtx.lineWidth = 1
                    this.extraCtx.setLineDash([]);
                    this.extraCtx.strokeStyle = "gold"
                    this.extraCtx.beginPath();
                    if(tower.nearEnemies.length >= 2){
                        this.extraCtx.moveTo(tower.target.x+12, tower.target.y+12);
                        this.extraCtx.lineTo(tower.nearEnemies[1].x+12, tower.nearEnemies[1].y+12);
                    }
                    if(tower.nearEnemies.length >= 3){
                        this.extraCtx.moveTo(tower.nearEnemies[1].x+12, tower.nearEnemies[1].y+12);
                        this.extraCtx.lineTo(tower.nearEnemies[2].x+12, tower.nearEnemies[2].y+12);
                    }
                    this.extraCtx.stroke();
                }

                if(tower.nearEnemies.length >= 1 && tower.type === "slow"){

                    tower.nearEnemies.forEach((enemy)=>{
                        this.extraCtx.beginPath();
                        this.extraCtx.lineWidth = 1
                        this.extraCtx.setLineDash([]);
                        this.extraCtx.strokeStyle = "lightblue"
                        this.extraCtx.beginPath();
                        this.extraCtx.moveTo(tower.x, tower.y);
                        this.extraCtx.lineTo(enemy.x+12, enemy.y+12);
                        this.extraCtx.stroke();
                    })
                }

                // turrets
                this.extraCtx.save();
                this.extraCtx.translate(tower.x,tower.y);
                this.extraCtx.rotate(tower.turretAngle)
                this.extraCtx.translate(-tower.x, -tower.y); 
                switch(tower.type){
                    case "slow":
                        this.extraCtx.drawImage(this.slowTurretTile, tower.x-25, tower.y-25, 50, 50)
                        break
                    case "stop":
                        this.extraCtx.drawImage(this.stopTurretTile, tower.x-25, tower.y-25, 50, 50)
                        break
                    case "laser":
                        this.extraCtx.drawImage(this.laserTurretTile, tower.x-25, tower.y-25, 50, 50)
                        break
                    case "chainLaser":
                        this.extraCtx.drawImage(this.chainLaserTurretTile, tower.x-25, tower.y-25, 50, 50)
                        break
                    case "aoe":
                        this.extraCtx.drawImage(this.aoeTurretTile, tower.x-25, tower.y-25, 50, 50)
                        break
                    case "sniper":
                        this.extraCtx.drawImage(this.sniperTurretTile, tower.x-37.5, tower.y-37.5, 75, 75)
                        break
                }
                this.extraCtx.restore();

            })
        }

        if(this.game.map.checkForTower(this.game.cursorAt.x,this.game.cursorAt.y)) return
        
        if(this.game.placingTower === true && this.game.map.tiles[this.game.cursorAt.x][this.game.cursorAt.y].road === false){
            
            const x = this.game.cursorAt.x * this.game.map.tileSize
            const y = this.game.cursorAt.y * this.game.map.tileSize

            this.extraCtx.beginPath();
            this.extraCtx.lineWidth = 0.5
            this.extraCtx.setLineDash([]);
            this.extraCtx.strokeStyle = "green"
            this.extraCtx.beginPath()
            this.extraCtx.arc(x+25,y+25, _TOWERS[this.game.placingTowerType].range, 0, 2*Math.PI)
            this.extraCtx.fillStyle = "rgba(0,255,0,0.15)"
            this.extraCtx.fill()
            this.extraCtx.stroke()

            switch(this.game.placingTowerType){
                case "slow":
                    this.ctx.drawImage(this.slowTurretTile, x, y, 50, 50)
                    break
                case "stop":
                    this.ctx.drawImage(this.stopTurretTile, x, y, 50, 50)
                    break
                case "laser":
                    this.ctx.drawImage(this.laserTurretTile, x, y, 50, 50)
                    break
                case "chainLaser":
                    this.ctx.drawImage(this.chainLaserTurretTile, x, y, 50, 50)
                    break
                case "aoe":
                    this.ctx.drawImage(this.aoeTurretTile, x, y, 50, 50)
                    break
                case "sniper":
                    this.ctx.drawImage(this.sniperTurretTile, x-10, y-10, 75, 75)
                    break
                
                case "boostDamage":
                    this.ctx.drawImage(this.boostDamageTile, x, y, 50, 50)
                    break
                
                case "boostRange":
                this.ctx.drawImage(this.boostRangeTile, x, y, 50, 50)
                break
            }
        }
    }

    lostGame(){
        let container = document.getElementById('endingContainer')
        container.classList.remove('notShown')
        container.classList.add('shown')
        let maxLevel = document.getElementById('maxLevelAchievedValue')
        maxLevel.innerText = this.game.level.id
    }

    updateButtons(){

        if(!this.game.levelStarted){
            this.game.infoPanel.startButton.classList.remove("disabledButton")
        }
        else{
            this.game.infoPanel.startButton.classList.add("disabledButton")
        }

        if(this.game.towerSelected !== null && this.game.towerSelected.level < this.game.towerSelected.maxLevel ){
            if(this.game.player.checkIfMoney(false , this.game.towerSelected.type)){
                this.game.infoPanel.upgradeButton.classList.remove("disabledButton")
                this.game.infoPanel.upgradeButton.innerHTML = `upgrade: $${this.game.towerSelected.upgradePrice}`
            }else{
                this.game.infoPanel.upgradeButton.classList.add("disabledButton")
                this.game.infoPanel.upgradeButton.innerHTML = `upgrade $${this.game.towerSelected.upgradePrice}`
            }
            this.game.infoPanel.sellButton.classList.remove("disabledButton")
            this.game.infoPanel.sellButton.innerHTML = `sell: $${this.game.towerSelected.sellPrice}`

        }
        else if (this.game.towerSelected !== null && this.game.towerSelected.level >= this.game.towerSelected.maxLevel){
           
            this.game.infoPanel.upgradeButton.classList.add("disabledButton")
            this.game.infoPanel.sellButton.classList.remove("disabledButton")
            this.game.infoPanel.sellButton.innerHTML = `sell: $${this.game.towerSelected.sellPrice}`
        }
        else{

            if(!this.game.infoPanel.upgradeButton.classList.contains("disabledButton")){
                this.game.infoPanel.upgradeButton.classList.add("disabledButton")
            }
            if(!this.game.infoPanel.sellButton.classList.contains("disabledButton")){
                this.game.infoPanel.sellButton.classList.add("disabledButton")
            }
            this.game.infoPanel.upgradeButton.innerHTML = `upgrade`
            this.game.infoPanel.sellButton.innerHTML = `sell`
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
        this.game.infoPanel.updateTowerButtons()
    }

}
