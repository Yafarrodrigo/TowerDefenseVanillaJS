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
    oldUpdateInterval = 16
    debugMode = false
    paused = false
    debug = new Debug(this)
    IdGen = new IdGenerator()
    graphics = new Graphics(this)
    player = new player(this)
    infoPanel = new InfoPanel(this)
    activeTowers = []
    activeBullets= []
    firstLevel = new Level(this,1,5,{health: 100, speed: 1, reward: 5})
    level = this.firstLevel
    
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

    constructor(gameParameters){
        const {roadNumber} = gameParameters
        if(!roadNumber){
            this.map = new Map(this, 0)
        }
        else{
            this.map = new Map(this, roadNumber)
        }

        this.enemiesToSpawn = this.createEnemies(this.level.enemyData)
    }

    setupAndStartGame(){
        this.map.create()
        this.player.addListeners()
        this.startClock()
    }

    upgradeEnemyData(){
        let oldEnemyData = this.level.enemyData
        let newEnemyData = {...oldEnemyData}
        let level = this.level.id +1

        if(level % 3 === 0){
            newEnemyData.speed = parseFloat(((oldEnemyData.speed*100 + 0.15*100)/100).toFixed(2))
        }
        if(level % 5 === 0){
            if(this.spawnFreq - 5 >= 10){
                this.spawnFreq -= 5
            }
            if((oldEnemyData.reward - 1) >= 1){
                newEnemyData.reward -= 1
            }
        }
        
        newEnemyData.health += 75

        return newEnemyData
    }

    createEnemies(enemyData){
        const {health, speed, reward} = enemyData
        let array = []
        for(let i = 0; i < this.level.qtyEnemies; i++){
            let newEnemy = new Enemy(this, -25,this.map.road[0][1]*this.map.tileSize +12, health,"right",speed, reward)
            array.push(newEnemy)
        }
        return array
    }

    nextLevel(){
       
        let newEnemyData = this.upgradeEnemyData()

        let newLevel = new Level(this,this.level.id+1,this.level.qtyEnemies+5, newEnemyData)

        this.level = newLevel
        this.infoPanel.updateHeader(newLevel)
        this.enemiesToSpawn = this.createEnemies(newLevel.enemyData)
        this.activeEnemies = []
    }

    startClock(interval){
        if(interval){
            this.timer = setInterval(()=>{
                this.update()
            }, (interval))
        }
        else{
            this.timer = setInterval(()=>{
                this.update()
            }, this.updateInterval)
        }
    }

    stopClock(){
        clearInterval(this.timer)
    }
    
    update(){

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
                    if(this.infoPanel.autoNextLevelCheckbox.checked){
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
                if(!tower.boosts){
                    tower.update()
                }
             })
        }  

        
        this.graphics.update()
    }
}
