import Enemy from "./Enemy.js"
import Graphics from "./Graphics.js"
import Map from "./Map.js"
import player from "./Player.js"
import Level from "./Level.js"
import InfoPanel from "./InfoPanel.js"
import IdGenerator from "../Classes/IdGen.js"
import Debug from "../Classes/Debug.js"

export default class Game{
    width = 800
    heigth = 600
    updateInterval = 16
    debugMode = true
    debug = new Debug(this)
    IdGen = new IdGenerator
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

    upgradeEnemyData(){
        let oldEnemyData = this.level.enemyData
        let newEnemyData = {...oldEnemyData}
        let level = this.level.id +1

        if(level % 3 === 0){
            newEnemyData.speed = oldEnemyData.speed + 0.15

        }
        else if(level % 5 === 0){
            if(this.spawnFreq - 5 >= 10){
                this.spawnFreq -= 5
            }
        }
        
        newEnemyData.health = oldEnemyData.health + 50

        return newEnemyData
    }

    createEnemies(enemyData){
        const {health, speed} = enemyData
        let array = []
        for(let i = 0; i < this.level.qtyEnemies; i++){
            let newEnemy = new Enemy(this, -25,this.map.road[0][1]*this.map.tileSize +12, health,"right",speed)
            array.push(newEnemy)
        }
        return array
    }

    nextLevel(){
       
        let newEnemyData = this.upgradeEnemyData()

        let newLevel = new Level(this,this.level.id+1,this.level.qtyEnemies+5, newEnemyData)

        this.level = newLevel
        this.infoPanel.updateHeader()
        this.enemiesToSpawn = this.createEnemies(newLevel.enemyData)
        this.activeEnemies = []
    }

    startClock(){
        this.timer = setInterval(()=>{
            this.update()
        }, (this.updateInterval)
    )}

    stopClock(){
        clearInterval(this.timer)
    }
    
    update(){
        
        this.debug.update()

        // NO MORE LIVES -> LOST GAME
        if(this.player.lives === 0) {
            this.stopClock()
            this.lost = true
            this.graphics.lostGame()
            return
        }

        // IF GAME STARTED -> START SPAWN COUNTER
        if(this.levelStarted === true){
            if(this.spawnCounter === this.spawnFreq){
                this.spawnCounter = 1
            }else{
                this.spawnCounter += 1
            }
    
            // IF ENEMIES IN SPAWN QUEUE -> SPAWN
            if(this.enemiesToSpawn.length > 0){
                if(this.spawnCounter % this.spawnFreq === 0){
                    
                    const enemyToSpawn = this.enemiesToSpawn.shift()
                    enemyToSpawn.spawned = true
                    this.activeEnemies.push(enemyToSpawn)
                }
            }
        }


        // UPDATE ENEMIES
        this.activeEnemies.forEach((enemy)=>{

            enemy.checkIfDead()

            if(enemy.dead === false && enemy.spawned === true){
                 enemy.update()
            }
            
            if(enemy.dead === true){
                if(this.level.isDone() === true && this.player.lives > 0 && this.levelStarted === true){
                    this.levelStarted = false
                    this.nextLevel()
                    if(this.game.infoPanel.autoNextLevelCheckbox.checked){
                        this.levelStarted = true
                    }
                }
            }
        })

        // UPDATE BULLETS
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

        // UPDATE TOWERS
        if(this.activeTowers.length !== 0){
            this.activeTowers.forEach((tower)=>{
                tower.update()
             })
        }  

        
        this.graphics.update()
    }
}
