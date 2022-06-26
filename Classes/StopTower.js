import Tower from "./Tower.js";
import _TOWERS from "../towersConfig.js";
import Status from "./Status.js";

export default class StopTower extends Tower {
    constructor(game,x, y){
        super(game,x, y)
        this.game = game,
        this.x = (x * this.game.map.tileSize) + 25
        this.y = (y * this.game.map.tileSize) + 25
        this.type = "stop"
        this.stoppingEnemy = false

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

            this.game.player.removeMoney(_TOWERS[this.type].upgradePrice)
            this.game.infoPanel.updateInfoDisplay(this,true,false)
        }  
    }

    update(){

        if(this.target && (this.target.health <= 0 || this.target.dead === true)) this.target = null

        this.updateNearbyBoostTowers()
        this.updateFinalDamageAndRange()

        this.updateNearEnemies()

        if(this.nearEnemies.length > 0){
            if(this.timer === 1 && this.stoppingEnemy === false){
                this.targetNearestEnemy()
                let newStatus = new Status("stop",this,this.slow)
                this.target && this.target.applyStatus(newStatus)
                this.stoppingEnemy = true
            }
            else if(this.timer === 100){

                this.target && this.target.removeStatus("stop")
                this.target = null
                this.stoppingEnemy = false
            }
            if(this.timer >= 175){
                this.timer = 1
            }else{
                this.timer += 1
            }

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