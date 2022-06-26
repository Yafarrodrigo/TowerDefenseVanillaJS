import _TOWERS from "../towersConfig.js"
import Tower from "./Tower.js"

export default class ChainLaserTower extends Tower{
    constructor(game,x, y){
        super(game,x, y)
        this.game = game,
        this.x = (x * this.game.map.tileSize) + 25
        this.y = (y * this.game.map.tileSize) + 25
        this.type = "chainLaser"

        this.damage = _TOWERS[this.type].damage
        this.finalDamage = this.damage
        this.secondaryDamage = _TOWERS[this.type].secondaryDamage
        this.finalSecondaryDamage = this.secondaryDamage
        this.range = _TOWERS[this.type].range
        this.finalRange = this.range
        this.description = _TOWERS[this.type].description
        this.upgradeDescription = _TOWERS[this.type].upgradeDescription
        this.speed = _TOWERS[this.type].speed

        this.projectiles = false
        this.boosts = false

        this.buyCost = _TOWERS[this.type].buyCost
        this.sellPrice = Math.floor(_TOWERS[this.type].buyCost / 2)
        this.upgradePrice = _TOWERS[this.type].upgradePrice
    }

    upgrade(){
        if(this.level >= 10){
            this.game.graphics.updateButtons()
            return
        }
        else {
            this.level += 1
            this.sellPrice += Math.round(_TOWERS[this.type].upgradePrice/2)

            this.damage = (Math.floor(_TOWERS[this.type].upgradeDamage*100) + Math.floor(this.damage*100))/100
            this.secondaryDamage = (Math.floor(_TOWERS[this.type].secondaryDamage*100) + Math.floor(this.secondaryDamage*100))/100
            this.range += _TOWERS[this.type].upgradeRange
  
            this.game.player.removeMoney(_TOWERS[this.type].upgradePrice)
            this.updateFinalDamageAndRange()
            this.game.infoPanel.updateInfoDisplay(this,true,false)
        }  
    }

    shoot(){
        if(this.validTarget(this.target)){      
            if(this.nearEnemies.length >= 3){
                if(this.nearEnemies[2].health - this.finalSecondaryDamage >= 0){
                    this.nearEnemies[2].health -= this.finalSecondaryDamage
                }else{
                    this.nearEnemies[2].health = 0
                }

                if(this.nearEnemies[1].health - this.finalSecondaryDamage >= 0){
                    this.nearEnemies[1].health -= this.finalSecondaryDamage
                }else{
                    this.nearEnemies[1].health = 0
                }
            }
            else if(this.nearEnemies.length >= 2){
                if(this.nearEnemies[1].health - this.finalSecondaryDamage >= 0){
                    this.nearEnemies[1].health -= this.finalSecondaryDamage
                }else{
                    this.nearEnemies[1].health = 0
                }
            }

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

    update(){

        if(this.target && (this.target.health <= 0 || this.target.dead === true)) this.target = null

        this.updateNearbyBoostTowers()
        this.updateFinalDamageAndRange()

        this.updateNearEnemies()
        this.targetNearestEnemy()
        

        if(this.nearEnemies.length > 0){
            this.shoot()
        }else{
            this.target = null
        }

        if(this.target !== null && this.target !== undefined){
            if(this.nearEnemies.length > 0){
                this.turretAngle = (Math.atan2((this.target.y+10 - this.y) , (this.target.x+10 - this.x)))
            }
        }
    }
}
