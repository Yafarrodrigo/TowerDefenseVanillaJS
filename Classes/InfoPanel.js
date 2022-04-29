export default class InfoPanel{
    level = document.getElementById("level")
    lives = document.getElementById("lives")
    money = document.getElementById("money")

    towerType = document.getElementById("towerType")
    towerLevel = document.getElementById("towerLevel")
    towerDamage = document.getElementById("towerDamage")
    towerRange = document.getElementById("towerRange")
    towerDesc = document.getElementById("towerDesc")

    upgradeButton = document.getElementById("upgradeTower")

    constructor(game){
        this.game = game

        this.upgradeButton.addEventListener("click", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            if(this.game.towerSelected === null) return

            if(this.game.player.checkIfMoney(false,this.game.towerSelected.type)){
                this.game.towerSelected.upgrade()
                this.updateTowerInfo(this.game.towerSelected)
            }
        })
    }

    updateTowerInfo(tower){
        this.towerType.innerText = tower.type
        this.towerLevel.innerText = tower.level
        this.towerDamage.innerText = tower.damage
        this.towerRange.innerText = tower.range
        this.towerDesc.innerText = tower.desc
    }
}