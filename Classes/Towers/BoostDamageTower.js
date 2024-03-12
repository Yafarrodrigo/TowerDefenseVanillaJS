import Tower from './Tower.js';
import _TOWERS from '../../towersConfig.js';

export default class BoostDamageTower extends Tower {
    constructor(game,x, y){
        super(game,x, y)
        this.game = game,
        this.x = (x * this.game.map.tileSize) + 25
        this.y = (y * this.game.map.tileSize) + 25
        this.type = 'boostDamage'

        this.maxLevel = _TOWERS[this.type].maxLevel
        this.range = _TOWERS[this.type].range
        this.finalRange = this.range
        this.description = _TOWERS[this.type].description
        this.upgradeDescription = _TOWERS[this.type].upgradeDescription
        this.speed = _TOWERS[this.type].speed

        this.bonusDamage = _TOWERS[this.type].bonusDamage
        this.bonusSecondaryDamage = _TOWERS[this.type].bonusSecondaryDamage
        this.bonusRange = _TOWERS[this.type].bonusRange

        this.projectiles = false
        this.boosts = true

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

            this.range += _TOWERS[this.type].upgradeRange
            this.slow = (Math.floor(_TOWERS[this.type].upgradeSlow*100) + Math.floor(this.slow*100))/100
            this.bonusRange = _TOWERS[this.type].bonusRange * this.level

            this.game.player.removeMoney(_TOWERS[this.type].upgradePrice)
            this.updateFinalDamageAndRange()
            this.game.infoPanel.updateInfoDisplay(this,true,false)
        }  
    }
}