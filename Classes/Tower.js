import _TOWERS from "../towersConfig.js"
import Bullet from "./Bullet.js"

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

        this.damage += _TOWERS[this.type].upgradeDamage
        this.secondaryDamage += _TOWERS[this.type].upgradeSecondaryDamage
        this.range += _TOWERS[this.type].upgradeRange
        this.slow += _TOWERS[this.type].upgradeSlow

        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`

        this.game.graphics.updateButtons()
    }

    shootProjectile(){

        if(this.target !== undefined && this.target !== null){
            
            if(this.target.dead === false){
                if(this.target.towerAttacking === null || this.target.towerAttacking.type !== "slow") { this.target.towerAttacking = this}
                const newBullet = new Bullet(this.game, this, this.target)
                this.game.activeBullets.push(newBullet)
            }else{
                this.target = null
            }


            if(this.target && this.distance(this.x,this.target.x + 25,this.y,this.target.y + 25) >= this.range){
                this.target.towerAttacking = null
                this.target = null
            }
        }else{
            this.targetNearestEnemy()
        }
    }

    shoot(){
        if(this.validTarget(this.target)){
            this.target.health -= this.damage
        }
        else{
            this.target = null
        }
    }

    validTarget(target){
        if(this.game.activeEnemies.length < 1) return false

        if(target!== null && target !== undefined && target.dead === false &&
            this.game.activeEnemies[target.id] !== null && this.game.activeEnemies[target.id] !== undefined){
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

                if( distance <= this.range && enemy.dead === false){
                    
                    if(!this.nearEnemies.hasOwnProperty(enemy.id)){
                        this.nearEnemies[enemy.id] = {enemy, dist: distance}
                    }
                }
                else{
                    if(this.nearEnemies.hasOwnProperty(enemy.id)){
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
        if(this.target === null && Object.keys(this.nearEnemies).length > 0){

            let possible = null

            for(let candidate in this.nearEnemies){
                
                if(possible === null){
                    possible = this.nearEnemies[candidate]
                }
                else if(this.nearEnemies[candidate].dist < possible.dist){
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
        this.updateNearEnemies()
        this.targetNearestEnemy()

        if(this.type === "projectiles" || this.type === "aoe"){
            if(this.timer === 30){
                this.timer = 1
                this.shootProjectile()
            }else{
                this.timer += 1
            }
        }else{
            
            this.shoot()
        }

        if(this.target !== null && this.target !== undefined){
            this.turretAngle = (Math.atan2((this.target.y+10 - this.y) , (this.target.x+10 - this.x)))
        }
    }
}
