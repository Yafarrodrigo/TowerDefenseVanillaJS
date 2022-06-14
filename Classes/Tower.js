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
        this.target = null
        this.targetInfo = null
        this.level = 1
        this.timer = 1
        this.showRadius = false
        this.sellPrice = 0
        this.turretAngle = Math.PI

        this.damage = _TOWERS[type].damage
        this.secondaryDamage = _TOWERS[type].secondaryDamage
        this.range = _TOWERS[type].range
        this.color = _TOWERS[type].color
        this.description = _TOWERS[type].description
        this.projectiles = _TOWERS[type].projectiles
        this.slow = _TOWERS[type].slow

        this.buyCost = _TOWERS[type].buyCost
        this.upgradeCost = _TOWERS[type].upgradeCost
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
        this.game.infoPanel.updateTowerInfo(this)
    }

    upgrade(){
        if(this.level >= 10) return
        else this.level +=1

        this.game.player.money -= _TOWERS[this.type].upgradeCost
        this.sellPrice += Math.round(_TOWERS[this.type].upgradeCost/2)

        this.damage = (Math.floor(_TOWERS[this.type].upgradeDamage*100) + Math.floor(this.damage*100))/100
        this.secondaryDamage += _TOWERS[this.type].upgradeSecondaryDamage
        this.range += _TOWERS[this.type].upgradeRange
        this.slow = (Math.floor(_TOWERS[this.type].upgradeSlow*100) + Math.floor(this.slow*100))/100

        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`

        this.game.graphics.updateButtons()
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
                        possibleEnemy.health -= this.damage
                        let newStatus = new Status("slow",this,this.slow)
                        possibleEnemy.applyStatus(newStatus)
                    }

                }    
 
            }
        }
        else{
            if(this.validTarget(this.target)){
                this.target.health -= this.damage
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

    updateNearEnemies(){
        if(this.game.activeEnemies.length > 0){
            
            this.game.activeEnemies.forEach((enemy)=>{

                let distance = this.distance(this.x+12,enemy.x+12,this.y+12,enemy.y+12)

                if( distance <= this.range+5 && enemy.dead === false){
                    
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

    update(){
        this.targetNearestEnemy()

        if(this.type === "projectiles" || this.type === "aoe"){
            if(this.timer === 30){
                this.timer = 1
                this.shoot()
            }else{
                this.timer += 1
            }
        }else{
            
            this.shoot()
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
