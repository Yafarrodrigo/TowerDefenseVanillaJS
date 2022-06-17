import _TOWERS from "../towersConfig.js"
import Bullet from "./Bullet.js"
import Status from "./Status.js"

export default class Tower{
    id = Math.floor(Math.random()*10000)
    constructor(game,x, y, type){
        this.game = game
        this.x = (x * 50) + 25
        this.y = (y * 50) + 25
        this.type = type
        this.nearEnemies = {}
        this.nearbyBoostTowers = {}
        this.target = null
        this.targetInfo = null
        this.level = 1
        this.timer = 1
        this.showRadius = false
        this.sellPrice = 0
        this.turretAngle = 0
        this.id = Math.floor(Math.random()*10000)

        this.damage = _TOWERS[type].damage
        this.finalDamage = this.damage
        this.secondaryDamage = _TOWERS[type].secondaryDamage
        this.finalSecondaryDamage = this.secondaryDamage
        this.range = _TOWERS[type].range
        this.finalRange = this.range
        this.color = _TOWERS[type].color
        this.description = _TOWERS[type].description
        this.upgradeDescription = _TOWERS[type].upgradeDescription
        this.projectiles = _TOWERS[type].projectiles
        this.slow = _TOWERS[type].slow

        this.bonusDamage = _TOWERS[type].bonusDamage
        this.bonusSecondaryDamage = _TOWERS[type].bonusSecondaryDamage
        this.bonusRange = _TOWERS[type].bonusRange

        this.buyCost = _TOWERS[type].buyCost
        this.upgradePrice = _TOWERS[type].upgradePrice
    }


    create(){
        this.tile = {
            x:(this.x -25) /50,
            y:(this.y -25 ) /50
        }
        this.game.graphics.changeTile(this.tile.x, this.tile.y, this.type)
        this.game.map.tiles[this.tile.x][this.tile.y].tower = true

        this.game.player.money -= this.buyCost
        this.sellPrice += Math.round(this.buyCost/2)

        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`
        this.game.towerSelected = this
    }

    upgrade(){
        if(this.level >= 10){
            this.game.graphics.updateButtons()
            return
        }
        else {
        
            this.level +=1

            this.game.player.money -= _TOWERS[this.type].upgradePrice
            this.sellPrice += Math.round(_TOWERS[this.type].upgradePrice/2)

            this.damage = (Math.floor(_TOWERS[this.type].upgradeDamage*100) + Math.floor(this.damage*100))/100
            this.secondaryDamage = (Math.floor(_TOWERS[this.type].secondaryDamage*100) + Math.floor(this.secondaryDamage*100))/100
            this.range += _TOWERS[this.type].upgradeRange
            this.slow = (Math.floor(_TOWERS[this.type].upgradeSlow*100) + Math.floor(this.slow*100))/100
            if(this.type === "boostRange"){
                this.bonusRange = _TOWERS[this.type].bonusRange * this.level
            }

            this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`

            this.updateFinalDamageAndRange()

            this.game.infoPanel.updateInfoDisplay(this,true,false)
        }
        
    }

    shoot(){
        if(this.type === "projectiles" || this.type === "aoe"){

            if(this.target && this.target.dead === false){
                const newBullet = new Bullet(this.game, this, this.target)
                this.game.activeBullets.push(newBullet)
            }else{
                this.target = null
            }

        }
        else if(this.type === "slow"){
            if(Object.keys(this.nearEnemies).length >= 1){
                
                for(let elem in this.nearEnemies){

                    let possibleEnemy = this.nearEnemies[elem].enemy
                    if(this.validTarget(possibleEnemy)){
                        if(possibleEnemy.health - this.finalDamage >= 0){
                            possibleEnemy.health -= this.finalDamage
                        }else{
                            possibleEnemy.health = 0
                        }

                        let newStatus = new Status("slow",this,this.slow)
                        possibleEnemy.applyStatus(newStatus)
                    }

                }    
 
            }
        }
        else{

            if(this.validTarget(this.target)){
                if(this.target.health - this.finalDamage >= 0){
                    this.target.health -= this.finalDamage
                }else{
                    this.target.health = 0
                }
            }
            else{
                this.target = null
            }
            
        }
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
        if(this.game.activeEnemies.length > 0){
            
            this.game.activeEnemies.forEach((enemy)=>{

                let distance = this.distance(this.x+12,enemy.x+12,this.y+12,enemy.y+12)

                if( distance <= this.finalRange+5 && enemy.dead === false){
                    
                    if(!this.nearEnemies.hasOwnProperty(enemy.id)){
                        this.nearEnemies[enemy.id] = {enemy, dist: distance}
                    }else{
                        this.nearEnemies[enemy.id].dist = distance
                    }
                }
                else{
                    if(this.nearEnemies.hasOwnProperty(enemy.id)){
                        enemy.removeStatus("slow")
                        delete this.nearEnemies[enemy.id]
                        if(this.target && this.target.id === enemy.id){
                            this.target = null
                        }
                    }
                }
            })


        }else{
            this.nearEnemies = {}
        }
    }

    targetNearestEnemy(){

        this.updateNearEnemies()

        if(this.target === null && Object.keys(this.nearEnemies).length > 0){

            let possible = null

            for(let candidate in this.nearEnemies){

                if(possible === null){
                    possible = this.nearEnemies[candidate]
                }else if(this.nearEnemies[candidate].dist < possible.dist){
                    possible = this.nearEnemies[candidate]
                }
            }
            
            
            if(possible !== null && this.validTarget(possible.enemy)){
                this.target = possible.enemy
            }
            else {
                this.target = null
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
    }

    update(){

        if(this.type === "boostDamage" || this.type === "boostRange") return

        
        this.updateNearbyBoostTowers()
        this.targetNearestEnemy()
        
        this.updateFinalDamageAndRange()

        if(this.type === "projectiles" || this.type === "aoe"){
            if(this.timer === 30){
                this.timer = 1
                this.shoot()
            }else{
                this.timer += 1
            }
        }else{
            if(this.type !== "boostDamage"){
                this.shoot()
            }
        }

        if(this.target !== null && this.target !== undefined){
            if(this.type === "slow" && Object.keys(this.nearEnemies).length > 0){
                if(this.turretAngle >= Math.PI*2){
                    this.turretAngle = 0
                }else{
                    this.turretAngle+=0.05
                }
            }
            else{
                this.turretAngle = (Math.atan2((this.target.y+10 - this.y) , (this.target.x+10 - this.x)))
            }
        }
    }
}
