import _TOWERS from "../../towersConfig.js"

export default class Tower{
    constructor(game,x, y){
        this.game = game
        this.id = this.game.IdGen.randomId()
        this.x = (x * this.game.map.tileSize) + 25
        this.y = (y * this.game.map.tileSize) + 25
        this.nearEnemies = []
        this.nearbyBoostTowers = {}
        this.target = null
        
        this.level = 1
        this.timer = 1
        this.showRadius = false
        this.turretAngle = 0
    }

    create(){
        this.tile = {
            x:(this.x -25) / this.game.map.tileSize,
            y:(this.y -25 ) / this.game.map.tileSize
        }
        this.game.graphics.changeTile(this.tile.x, this.tile.y, this.type)
        this.game.map.tiles[this.tile.x][this.tile.y].tower = true

        this.game.player.removeMoney(this.buyCost)

        this.game.towerSelected = this
    }

    validTarget(target){
        if(this.game.activeEnemies.length < 1) return false

        if(target!== null && target !== undefined && target.dead === false && target.spawned === true){
            return true 
        }
        else{
            return false
        }
    }

    updateNearbyBoostTowers(){
        if(this.game.activeTowers.length > 0){

            this.game.activeTowers.forEach((tower)=>{

                if(tower.type === "boostDamage" || tower.type === "boostRange"){
                    let distance = this.distance(this.x+12,tower.x+12,this.y+12,tower.y+12)

                    if( distance <= tower.range+5){
                        
                        if(!this.nearbyBoostTowers.hasOwnProperty(tower.id)){
                            this.nearbyBoostTowers[tower.id] = tower
                        }
                    }
                    else{
                        if(this.nearbyBoostTowers.hasOwnProperty(tower.id)){
                            delete this.nearbyBoostTowers[tower.id]
                        }
                    }
                }
            })
        }
        else{
            this.nearbyBoostTowers = {}
        }

    }

    updateNearEnemies(){
        this.nearEnemies = []
        let nearby = {}
        if(this.game.activeEnemies.length > 0){
            
            this.game.activeEnemies.forEach((enemy)=>{

                let distance = this.distance(this.x+12,enemy.x+12,this.y+12,enemy.y+12)

                if( distance <= this.finalRange+5 && enemy.dead === false){
                    
                    if(!nearby.hasOwnProperty(enemy.id)){
                        nearby[enemy.id] = {enemy, dist: distance}
                    }else{
                        nearby[enemy.id].dist = distance
                    }
                }
                else{
                    if(nearby.hasOwnProperty(enemy.id)){
                        enemy.removeStatus("slow")
                        enemy.removeStatus("stop")
                        delete nearby[enemy.id]
                        if(this.target && this.target.id === enemy.id){
                            this.target = null
                        }
                    }
                }
            })    
        
            

        }else{
            nearby = {}
        }

        let almostReady = Object.entries(nearby).sort((x, y) => x[1].dist - y[1].dist)
        almostReady.forEach(elem => this.nearEnemies.push(elem[1].enemy))
    }

    targetNearestEnemy(){

        if(this.nearEnemies.length > 0){
            if(this.target === null){
                this.target = this.nearEnemies[0]
            }
            else{
                if(this.distance(this.x+12,this.target.x+12,this.y+12,this.target.y+12) > this.finalRange){
                    this.target = this.nearEnemies[0]
                }
            }
        }
    }

    targetRandomEnemy(){

        if(this.nearEnemies.length > 0){
            if(this.target === null){
                this.target = this.nearEnemies[Math.floor(Math.random()*this.nearEnemies.length)]
            }
        }
    }

    targetHighestHealthEnemy(){

        if(this.nearEnemies.length > 0){
            let higher = this.target || this.nearEnemies[0]
            
            this.nearEnemies.forEach( enemy => {
                if(enemy.health > higher.health) higher = enemy
            })
            
            this.target = higher
        }
    }

    targetLowestHealthEnemy(){

        if(this.nearEnemies.length > 0){
            if(this.target === null){
                let lower = this.target || this.nearEnemies[0]
                
                this.nearEnemies.forEach( enemy => {
                    if(enemy.health < lower.health) lower = enemy
                })
                
                this.target = lower
            }
        }
    }

    distance(x0,x1,y0,y1){
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
    }

    updateFinalDamageAndRange(){
        if(Object.keys(this.nearbyBoostTowers).length > 0){
            let sumBonus = 0
            let secondarySumBonus = 0
            let sumRangeBonus = 0
            for(let tower in this.nearbyBoostTowers){
                sumBonus = (Math.floor(sumBonus*1000) + Math.floor(this.nearbyBoostTowers[tower].bonusDamage * 1000)) /1000
                secondarySumBonus = (Math.floor(secondarySumBonus*1000) + Math.floor(this.nearbyBoostTowers[tower].bonusSecondaryDamage * 1000)) /1000
                sumRangeBonus += this.nearbyBoostTowers[tower].bonusRange
            }
            sumBonus+=1
            secondarySumBonus+=1

            this.finalDamage = parseFloat(((Math.floor(this.damage*100) * (Math.floor(sumBonus*100)))/10000).toFixed(2))
            this.finalSecondaryDamage = parseFloat(((Math.floor(this.secondaryDamage*100) * (Math.floor(secondarySumBonus*100)))/10000).toFixed(2))
            this.finalRange = this.range + sumRangeBonus
        }else{
            this.finalDamage = this.damage
            this.finalSecondaryDamage = this.secondaryDamage
            this.finalRange = this.range
        }

        let dmgBoost = 1.5
        let rangeBoost = 1.5

        // check for masteries
        if(this.game.masteries.check('laserMastery') && (this.type === "laser" || this.type === "chainLaser")){
            this.finalDamage = parseFloat(((Math.floor(this.finalDamage*100) * (Math.floor( dmgBoost *100)))/10000).toFixed(2))
        }
        if(this.game.masteries.check('slowMastery') && this.type === "slow"){
            this.finalRange = parseFloat(((Math.floor(this.finalRange*100) * (Math.floor( rangeBoost *100)))/10000).toFixed(2))
        }

    }

}
