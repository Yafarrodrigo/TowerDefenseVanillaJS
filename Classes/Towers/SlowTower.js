import Tower from "./Tower.js";
import _TOWERS from "../../towersConfig.js";
import Status from "../Status.js";

export default class SlowTower extends Tower {
    constructor(game,x, y){
        super(game,x, y)
        this.game = game,
        this.x = (x * this.game.map.tileSize) + 25
        this.y = (y * this.game.map.tileSize) + 25
        this.type = "slow"

        this.maxLevel = _TOWERS[this.type].maxLevel
        this.damage = _TOWERS[this.type].damage
        this.finalDamage = this.damage
        this.secondaryDamage = _TOWERS[this.type].secondaryDamage
        this.finalSecondaryDamage = this.secondaryDamage
        this.range = _TOWERS[this.type].range
        this.finalRange = this.range
        this.description = _TOWERS[this.type].description
        this.upgradeDescription = _TOWERS[this.type].upgradeDescription
        this.speed = _TOWERS[this.type].speed
        this.slow = _TOWERS[this.type].slow

        this.projectiles = false
        this.boosts = false

        this.buyCost = _TOWERS[this.type].buyCost
        this.sellPrice = Math.floor(_TOWERS[this.type].buyCost / 2)
        this.upgradePrice = _TOWERS[this.type].upgradePrice
    }

    upgrade(){
        if(this.level >= this.maxLevel){
            this.game.graphics.updateButtons()
            return
        }
        else {
            this.level += 1
            this.sellPrice += Math.round(_TOWERS[this.type].upgradePrice/2)

            this.damage = (Math.floor(_TOWERS[this.type].upgradeDamage*100) + Math.floor(this.damage*100))/100
            this.range += _TOWERS[this.type].upgradeRange
            this.slow = (Math.floor(_TOWERS[this.type].upgradeSlow*100) + Math.floor(this.slow*100))/100

            this.game.player.removeMoney(_TOWERS[this.type].upgradePrice)
            this.updateFinalDamageAndRange()
            this.game.infoPanel.updateInfoDisplay(this,true,false)
        }  
    }

    shoot(){
        if(this.nearEnemies.length >= 1){

            this.nearEnemies.forEach( enemy => {
                if(this.validTarget(enemy)){
                    if(enemy.health - this.finalDamage >= 0){
                        enemy.health -= this.finalDamage
                    }else{
                        enemy.health = 0
                    }
                    let newStatus = new Status("slow",this,this.slow)
                    enemy.applyStatus(newStatus)
                }
            })
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
                if(this.turretAngle >= Math.PI*2){
                    this.turretAngle = 0
                }else{
                    this.turretAngle+=0.05
                }
            }
        }
    }
}