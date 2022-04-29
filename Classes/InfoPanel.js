export default class InfoPanel{
    level = document.getElementById("level")
    lives = document.getElementById("lives")
    money = document.getElementById("money")

    towerType = document.getElementById("towerType")
    towerLevel = document.getElementById("towerLevel")
    towerDamage = document.getElementById("towerDamage")
    towerRange = document.getElementById("towerRange")
    towerDesc = document.getElementById("towerDesc")
    showRadiusCheckbox = document.getElementById("showRadius")


    upgradeButton = document.getElementById("upgradeTower")
    sellButton = document.getElementById("sellTower")

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

        this.sellButton.addEventListener("click", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            let tower

            if(this.game.towerSelected === null) return
            else tower = this.game.towerSelected

            this.game.map.tiles[tower.tile.x][tower.tile.y].tower = false
            this.game.graphics.changeTile(tower.tile.x, tower.tile.y, "grey")

            this.game.player.money += tower.sellPrice
            this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`

            this.game.activeTowers = this.game.activeTowers.filter((tower)=>{
                if(tower.id !== this.game.towerSelected.id) return true
            })
            this.game.towerSelected = null
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