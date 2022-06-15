import _TOWERS from "../towersConfig.js"

export default class InfoPanel{
    level = document.getElementById("level")
    lives = document.getElementById("lives")
    money = document.getElementById("money")

    showRadiusCheckbox = document.getElementById("showRadius")
    autoNextLevelCheckbox = document.getElementById("autoNextLevel")
    startButton = document.getElementById("startButton")


    damageIcon = new Image()
    extraDamageIcon = new Image()
    rangeIcon = new Image()

    upgradeButton = document.getElementById("upgradeTower")
    sellButton = document.getElementById("sellTower")
    buyButton = document.getElementById("buyTower")

    infoCanvas = document.getElementById("infoCanvas")
    infoCtx = infoCanvas.getContext("2d")

    constructor(game){
        this.game = game

        this.damageIcon.src = "../Images/damageIcon.png"
        this.extraDamageIcon.src = "../Images/extraDamageIcon.png"
        this.rangeIcon.src = "../Images/rangeIcon.png"

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

            this.game.infoPanel.updateInfoDisplay(this.game.towerSelected, false, false)
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

    updateInfoDisplay(tower, upgrade = false, buying = false){
        this.infoCtx.fillStyle = "#555"
        this.infoCtx.fillRect(0,0,300,200)

        if(tower){

            this.infoCtx.fillStyle = "white"
            this.infoCtx.font = "25px Arial";

            if(buying === true){
                this.infoCtx.textAlign = "right";
                this.infoCtx.fillText(`$${_TOWERS[tower.type].buyCost}`, 285, 30)
                this.infoCtx.textAlign = "left";
                this.infoCtx.fillText(`${tower.type} tower`, 25, 30)
            }else{
                this.infoCtx.textAlign = "left";
                this.infoCtx.fillText(`${tower.type} tower (Lv. ${tower.level})`, 25, 30)
            }
            this.infoCtx.textAlign = "left";
            this.infoCtx.drawImage(this.damageIcon, 55, 52)
            this.infoCtx.fillText(`${tower.damage}`, 105, 72)
            this.infoCtx.drawImage(this.extraDamageIcon, 51, 85)
            this.infoCtx.fillText(`${tower.secondaryDamage}`, 105, 110)
            this.infoCtx.drawImage(this.rangeIcon, 51, 120)
            this.infoCtx.fillText(`${tower.range}`, 105, 145)
            
            
            if(upgrade){
                this.infoCtx.fillStyle = "green"
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeDamage}`, 230, 75)
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeSecondaryDamage}`, 230, 115)
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeRange}`, 230, 155)
                if(tower.upgradeDescription !== null){
                    this.infoCtx.textAlign = "center";
                    this.infoCtx.fillText(tower.upgradeDescription, (this.infoCanvas.width/2), 190)
                } 
                else{
                    this.infoCtx.fillStyle = "white"
                    this.infoCtx.textAlign = "center";
                    this.infoCtx.fillText(tower.description, (this.infoCanvas.width/2), 190)
                }
            }
            else{
                this.infoCtx.fillStyle = "white"
                this.infoCtx.textAlign = "center";
                this.infoCtx.fillText(tower.description, (this.infoCanvas.width/2), 190)
            }
        }
    }

    buyTower(type){

        if(this.game.placingTower === false && this.game.player.checkIfMoney(true, type)){
            this.game.placingTower = true
            this.game.placingTowerType = type
            this.game.infoPanel.updateInfoDisplay(_TOWERS[type],false,true)
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
                this.updateInfoDisplay(_TOWERS[tower],false,true)
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