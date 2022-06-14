import _TOWERS from "../towersConfig.js"

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
    autoNextLevelCheckbox = document.getElementById("autoNextLevel")

    startButton = document.getElementById("startButton")
    upgradeButton = document.getElementById("upgradeTower")
    sellButton = document.getElementById("sellTower")
    buyButton = document.getElementById("buyTower")

    infoCanvas = document.getElementById("infoCanvas")
    infoCtx = infoCanvas.getContext("2d")

    constructor(game){
        this.game = game

        this.upgradeButton.addEventListener("click", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            if(this.game.towerSelected === null) return

            if(this.game.player.checkIfMoney(false,this.game.towerSelected.type)){
                this.game.towerSelected.upgrade()
            }
        })

        this.upgradeButton.addEventListener("mouseover", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            if(this.game.towerSelected === null) return

            this.game.infoPanel.updateInfoDisplay(this.game.towerSelected, true)
        })

        this.upgradeButton.addEventListener("mouseleave", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            if(this.game.towerSelected === null) return

            this.game.infoPanel.updateInfoDisplay(this.game.towerSelected, false)
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

        this.startButton.addEventListener("click", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            if(game.levelStarted === false){
                this.game.levelStarted = true
                this.startButton.innerText = "Next Wave"
            }
        })

        this.createTowerButtons()
        this.updateInfoDisplay()
    }

    updateInfoDisplay(tower, upgrade=false){
        this.infoCtx.fillStyle = "#555"
        this.infoCtx.fillRect(0,0,300,200)

        if(tower){
            this.infoCtx.fillStyle = "white"
            this.infoCtx.font = "25px Arial";
            this.infoCtx.fillText(`Tower type: ${tower.type}`, 10, 30)
            this.infoCtx.fillText(`Damage: ${tower.damage}`, 10, 65)
            this.infoCtx.fillText(`Range: ${tower.range}`, 10, 100)
            this.infoCtx.fillText(`Upgrade Cost: ${tower.upgradePrice}`, 10, 135)
            this.infoCtx.fillText(`Sell price: ${tower.sellPrice}`, 10, 170)
            
            if(upgrade){
                this.infoCtx.fillStyle = "green"
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeDamage}`, 225, 65)
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeRange}`, 225, 100)
                this.infoCtx.fillText(`+ ${Math.round(_TOWERS[tower.type].upgradePrice/2)}`, 225, 170)
            }
        }
    }

    buyTower(type){

        if(this.game.placingTower === false && this.game.player.checkIfMoney(true, type)){
            this.game.placingTower = true
            this.game.placingTowerType = type
            this.game.infoPanel.updateInfoDisplay(_TOWERS[type])
        }else{
            this.game.placingTower = false
            this.game.placingTowerType = null
        }
    }

    createTowerButtons(){
        const container = document.getElementById("towerButtons")

        for(let tower in _TOWERS){

            const button = document.createElement("button")
            button.id = _TOWERS[tower].type
            button.classList.add("buyTowerIcon")

            button.addEventListener("click", (e)=>{
                e.preventDefault()
                this.game.placingTower = false
                this.game.placingTowerType = false
                this.game.towerSelected = null
                this.buyTower(tower)
            })

            button.addEventListener("mouseenter", (e)=>{
                e.preventDefault()
                this.updateInfoDisplay(_TOWERS[tower])
                button.style.border = "solid 2px yellow"
            })

            button.addEventListener("mouseleave", (e)=>{
                e.preventDefault()
                if(this.game.placingTower === false){
                    this.updateInfoDisplay()
                }
                button.style.border = "solid 2px black"
            })


            button.style.backgroundImage = `URL(${_TOWERS[tower].iconSrc})`
            container.append(button)
        }
    }

    updateTowerButtons(){
        document.querySelectorAll(".buyTowerIcon").forEach((button)=>{
            if(this.game.player.checkIfMoney(true, button.id)){
                button.style.opacity = "1"
            }else{
                button.style.opacity = "0.5"
            }
        })
    }
}