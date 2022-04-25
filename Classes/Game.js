import Enemy from "./Enemy.js"
import Graphics from "./Graphics.js"
import Map from "./Map.js"
import player from "./Player.js"
import Level from "./Level.js"

export default class Game{
    graphics = new Graphics(this)
    map = new Map(this)
    player = new player(this)
    activeTowers = []
    allLevels = [new Level(this,1,5, {health: 100, speed: 1})]
    level = this.allLevels[0]
    activeEnemies = this.createEnemies(this.level.enemyData)
    spawnCounter = 0
    spawnFreq = 75
    infoLevel= document.getElementById("level")
    infoLives= document.getElementById("lives")

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
        let newLevel = new Level(this,this.level.id+1,this.level.qtyEnemies+5, {health: oldEnemyData.health + 25, speed: oldEnemyData.speed + 0.1})
        if(this.spawnFreq > 10){
            this.spawnFreq -= 5
        }
        this.level = newLevel
        this.infoLevel.innerText = `LEVEL: ${newLevel.id}`
        this.activeEnemies = this.createEnemies(newLevel.enemyData)
        this.startClock()
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
            alert("PERDISTE")
            location.reload()
            return
        }

         if(this.level.isDone() === true  && this.player.lives !== 0){
            this.stopClock()
            console.log(`LEVEL ${this.level.id +1}`)
            this.nextLevel()
        }
        
        if(this.spawnCounter % this.spawnFreq === 0 &&
            (this.spawnCounter / this.spawnFreq) < this.activeEnemies.length){

            this.activeEnemies[(this.spawnCounter/this.spawnFreq)].spawned = true 
        }

        if(this.spawnCounter === this.activeEnemies.length * this.spawnFreq){
            this.spawnCounter = 0
        }else{
            this.spawnCounter += 1
        }

        this.activeEnemies.forEach((enemy)=>{
            if(enemy.dead === false && enemy.spawned === true){
                enemy.update()
            }

            if(enemy.health <= 0){
                enemy.dead = true
            }
        })

        if(this.activeTowers.length !== 0){
            this.activeTowers.forEach((tower)=>{
                tower.targetNearestEnemy()
                if(tower.target != null){
                    tower.shoot()
                }
            })
        }  
        
        this.graphics.updateTowers()
        this.graphics.displayEnemies()
    }
}
