import _TOWERS from '../towersConfig.js'
import _PATHS from '../imgPaths.js'

export default class EditorGraphics{
    canvas = document.getElementById('canvas')
    ctx = this.canvas.getContext('2d')

    extraCanvas = document.getElementById('extra-canvas')
    extraCtx = this.extraCanvas.getContext('2d')

    floorTile = new Image()
    roadFloor = new Image()

    constructor(map){
        this.map = map
        this.floorTile.src = _PATHS.floor
        this.roadFloor.src = _PATHS.roadFloor
    }

    changeTile(x, y, type){

        this.map.tiles[x][y].type = type
        if(type === 'road'){
            this.ctx.drawImage(this.roadFloor, x * this.map.tileSize, y * this.map.tileSize, this.map.tileSize, this.map.tileSize)
        }
        else{
            this.ctx.drawImage(this.floorTile, x * this.map.tileSize, y * this.map.tileSize, this.map.tileSize, this.map.tileSize)
        }
    }

    drawBg(){
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0,0,800,600)

        for(let x = 0; x < 16; x++){
            for(let y = 0; y < 12; y++){
                this.changeTile(x,y,'floor')
            }
        }
    }
    
    drawRoad(){
        this.map.newRoad.getRoad().forEach( tile => {
            this.ctx.drawImage(
                this.roadFloor,
                tile[0] *  this.map.tileSize,
                tile[1] *  this.map.tileSize,
                this.map.tileSize,
                this.map.tileSize)
        })
    }

    displayEnemies(){

        let enemies = this.game.activeEnemies

        for(let i = enemies.length-1; i >= 0; i--){
            if(enemies[i].dead === false && enemies[i].spawned === true){
    
                let healthPercent = Math.floor(enemies[i].health/enemies[i].maxHealth *100)
                if(healthPercent > 66){
                    this.ctx.fillStyle = 'green'
                }
                else if (healthPercent > 33){
                    this.ctx.fillStyle = 'orange'
                }
                else{
                    this.ctx.fillStyle = 'red'
                }

                this.ctx.fillRect(enemies[i].x -1, enemies[i].y-10,healthPercent*0.3, 5)

                this.ctx.save()
                this.ctx.translate(enemies[i].x+15, enemies[i].y+15)
                
                if(enemies[i].direction === 'up'){
                    this.ctx.rotate(-Math.PI/2)
                }else if(enemies[i].direction === 'down'){
                    this.ctx.rotate(Math.PI/2)
                }else if(enemies[i].direction === 'left'){
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
                this.ctx.fillStyle = 'red'
                this.ctx.fillRect(bullet.x,bullet.y,5,5)
            })
        }
    }


    updateButtons(){

        if(!this.game.levelStarted){
            this.game.infoPanel.startButton.classList.remove('disabledButton')
        }
        else{
            this.game.infoPanel.startButton.classList.add('disabledButton')
        }

        if(this.game.towerSelected !== null && this.game.towerSelected.level < this.game.towerSelected.maxLevel ){
            if(this.game.player.checkIfMoney(false , this.game.towerSelected.type)){
                this.game.infoPanel.upgradeButton.classList.remove('disabledButton')
                this.game.infoPanel.upgradeButton.innerHTML = `upgrade: $${this.game.towerSelected.upgradePrice}`
            }else{
                this.game.infoPanel.upgradeButton.classList.add('disabledButton')
                this.game.infoPanel.upgradeButton.innerHTML = `upgrade $${this.game.towerSelected.upgradePrice}`
            }
            this.game.infoPanel.sellButton.classList.remove('disabledButton')
            this.game.infoPanel.sellButton.innerHTML = `sell: $${this.game.towerSelected.sellPrice}`

        }
        else if (this.game.towerSelected !== null && this.game.towerSelected.level >= this.game.towerSelected.maxLevel){
           
            this.game.infoPanel.upgradeButton.classList.add('disabledButton')
            this.game.infoPanel.sellButton.classList.remove('disabledButton')
            this.game.infoPanel.sellButton.innerHTML = `sell: $${this.game.towerSelected.sellPrice}`
        }
        else{

            if(!this.game.infoPanel.upgradeButton.classList.contains('disabledButton')){
                this.game.infoPanel.upgradeButton.classList.add('disabledButton')
            }
            if(!this.game.infoPanel.sellButton.classList.contains('disabledButton')){
                this.game.infoPanel.sellButton.classList.add('disabledButton')
            }
            this.game.infoPanel.upgradeButton.innerHTML = `upgrade`
            this.game.infoPanel.sellButton.innerHTML = `sell`
        }
    }

    displayCursorRoad(x,y){
        this.extraCtx.drawImage(
            this.roadFloor,
            x * this.map.tileSize,
            y * this.map.tileSize,
            this.map.tileSize,
            this.map.tileSize
            )

        
        if(this.map.newRoad.size < 1) return

        const lastNode = this.map.newRoad.getLastNode()
        const firstPoint = [lastNode.x,lastNode.y]
        const secondPoint = [x,y]

        if(firstPoint[0] === secondPoint[0]){
            if(secondPoint[1] >= firstPoint[1]){
                for(let j = 1; j <= Math.abs(secondPoint[1]-firstPoint[1]); j++){
                    this.ctx.drawImage(
                        this.roadFloor,
                        (firstPoint[0] * this.map.tileSize),
                        (firstPoint[1] * this.map.tileSize) + j * this.map.tileSize,
                        this.map.tileSize,
                        this.map.tileSize)
                }
            }else{
                for(let j = Math.abs(secondPoint[1]-firstPoint[1]); j > 0 ; j--){
                    this.ctx.drawImage(
                        this.roadFloor,
                        (firstPoint[0] * this.map.tileSize),
                        (firstPoint[1] * this.map.tileSize) - j * this.map.tileSize,
                        this.map.tileSize,
                        this.map.tileSize)
                }
            }
        }
        // HORIZONTAL
        else if (firstPoint[1] === secondPoint[1]){
            if(secondPoint[0] >= firstPoint[0]){
                for(let j = 1; j <= Math.abs(secondPoint[0]-firstPoint[0]); j++){
                    this.ctx.drawImage(
                        this.roadFloor,
                        (firstPoint[0] * this.map.tileSize) + j * this.map.tileSize,
                        (firstPoint[1] * this.map.tileSize),
                        this.map.tileSize,
                        this.map.tileSize)
                }
            }else{
                for(let j = Math.abs(secondPoint[0]-firstPoint[0]); j > 0 ; j--){
                    this.ctx.drawImage(
                        this.roadFloor,
                        (firstPoint[0] * this.map.tileSize)- j * this.map.tileSize,
                        (firstPoint[1] * this.map.tileSize),
                        this.map.tileSize,
                        this.map.tileSize)
                }
                }
        }
    }

    update(x,y,placingTile,placingTileType){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.extraCtx.clearRect(0, 0, this.extraCanvas.width, this.extraCanvas.height);

        this.drawBg()
        this.drawRoad()
        if(placingTile && placingTileType === 'road'){
            this.displayCursorRoad(x,y)
        }

        const lastTile = this.map.newRoad.getLastNode()
        if(lastTile){
            this.ctx.fillStyle = "rgba(0,255,0,0.5)"
            this.ctx.fillRect(
            lastTile.x * this.map.tileSize,
            lastTile.y * this.map.tileSize,
            this.map.tileSize,
            this.map.tileSize)
        }
    }

}
