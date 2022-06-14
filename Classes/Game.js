import Enemy from "./Enemy.js"
import Graphics from "./Graphics.js"
import Map from "./Map.js"
import player from "./Player.js"
import Level from "./Level.js"
import InfoPanel from "./InfoPanel.js"

export default class Game{
    graphics = new Graphics(this)
    map = new Map(this)
    player = new player(this)
    infoPanel = new InfoPanel(this)
    activeTowers = []
    activeBullets= []
    allLevels = [new Level(this,1,5, {health: 100, speed: 1})]
    level = this.allLevels[0]
    enemiesToSpawn = this.createEnemies(this.level.enemyData)
    activeEnemies = []
    qtyEnemies = this.level.qtyEnemies
    levelStarted = false
    spawnCounter = 0
    spawnFreq = 40
    towerSelected = null
    placingTower = false
    placingTowerType = null
    cursorAt = {x:0, y:0}
    lost = false

    createEnemies(enemyData){
        const {health, speed} = enemyData
        let array = []
        for(let i = 0; i < this.level.qtyEnemies; i++){
            let newEnemy = new Enemy(this, i, -25,this.map.road[0][1]*50 +12, health,"right",speed)
            array.push(newEnemy)
        }
        return array
    }

    nextLevel(){
        let oldEnemyData = this.level.enemyData
        let newLevel = new Level(this,this.level.id+1,this.level.qtyEnemies+5, {health: oldEnemyData.health + 50, speed: oldEnemyData.speed + 0.1})
        if(this.spawnFreq > 10){
            this.spawnFreq -= 2
        }
        this.level = newLevel
        this.infoPanel.level.innerText = `LEVEL: ${newLevel.id}`
        this.enemiesToSpawn = this.createEnemies(newLevel.enemyData)
        this.activeEnemies = []
    }

    startClock(){
        this.timer = setInterval(()=>{
            this.update()
        },16)
    }
    stopClock(){
        clearInterval(this.timer)
    }
    
    update(){
        if(this.player.lives === 0) {
            this.stopClock()
            this.lost = true
            this.graphics.lostGame()
            return
        }

        if(this.levelStarted === true){
            if(this.spawnCounter === (this.level.qtyEnemies * this.spawnFreq)+this.spawnFreq){
                this.spawnCounter = 0
            }else{
                this.spawnCounter += 1
            }
    
            if(this.enemiesToSpawn.length > 0){
                if(this.spawnCounter % this.spawnFreq === 0){
                    
                    const enemyToSpawn = this.enemiesToSpawn.shift()
                    enemyToSpawn.spawned = true
                    this.activeEnemies.push(enemyToSpawn)
                }
            }
        }

        this.activeEnemies.forEach((enemy)=>{

            enemy.checkIfDead()

            if(enemy.dead === false && enemy.spawned === true){
                 enemy.update()
            }
            
            if(enemy.dead === true){
                if(this.level.isDone() === true && this.player.lives > 0 && this.levelStarted === true){
                    this.levelStarted = false
                    this.nextLevel()
                    if(this.infoPanel.autoNextLevelCheckbox.checked === true){
                        this.levelStarted = true
                    }
                }
            }
        })
        
        if(this.activeTowers.length !== 0){
            this.activeTowers.forEach((tower)=>{
                tower.update()
             })
        }  

        this.activeBullets.forEach((bullet)=>{
            if(bullet.dead !== true){
                bullet.update()
            }
            else{
                this.activeBullets = this.activeBullets.filter((bullet)=>{
                    if(bullet.dead === false) return true
                })
            }
        })

        this.graphics.update()
    }
}
