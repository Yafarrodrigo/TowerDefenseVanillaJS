import _PATHS from "../imgPaths.js"
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
    bonusDamageIcon = new Image()
    bonusRangeIcon = new Image()
    speedIcon = new Image()

    upgradeButton = document.getElementById("upgradeTower")
    sellButton = document.getElementById("sellTower")
    buyButton = document.getElementById("buyTower")

    infoCanvas = document.getElementById("infoCanvas")
    infoCtx = infoCanvas.getContext("2d")

    constructor(game){
        this.game = game

        this.damageIcon.src = _PATHS.damageIcon
        this.extraDamageIcon.src = _PATHS.extraDamageIcon
        this.rangeIcon.src = _PATHS.rangeIcon
        this.bonusDamageIcon.src = _PATHS.bonusDamageIcon
        this.bonusRangeIcon.src = _PATHS.bonusRangeIcon
        this.speedIcon.src = _PATHS.speedIcon

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

            this.game.activeTowers.forEach(t =>{
                if(Object.keys(t.nearbyBoostTowers).length > 0){
                    delete t.nearbyBoostTowers[tower.id]
                }
                t.updateFinalDamageAndRange()
            })
            
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
            this.infoCtx.font = "20px Coda";


            if(buying === true){

                this.infoCtx.textAlign = "left";
                this.infoCtx.fillText(`${tower.type} tower`, 25, 30)
                
                if(tower.type === "boostDamage" || tower.type === "boostRange"){
                    this.infoCtx.drawImage(this.bonusDamageIcon, 43, 35)
                    this.infoCtx.drawImage(this.bonusRangeIcon, 43, 75)
                    this.infoCtx.drawImage(this.rangeIcon, 51, 120)
                    this.infoCtx.fillText(`+ ${tower.bonusDamage} %`, 105, 72)
                    this.infoCtx.fillText(`+ ${tower.bonusRange}`, 105, 110)
                    this.infoCtx.fillText(`${tower.range}`, 105, 145)
                }
                else{
                    this.infoCtx.drawImage(this.damageIcon, 55, 52)
                    this.infoCtx.drawImage(this.extraDamageIcon, 51, 85)
                    this.infoCtx.drawImage(this.rangeIcon, 51, 120)
                    this.infoCtx.fillText(`${tower.type} tower`, 25, 30)
                    this.infoCtx.fillText(`${tower.damage}`, 105, 72)
                    this.infoCtx.fillText(`${tower.secondaryDamage}`, 105, 110)
                    this.infoCtx.fillText(`${tower.range}`, 105, 145)
                }

                this.infoCtx.textAlign = "right";
                this.infoCtx.fillStyle = "lightgrey"
                this.infoCtx.fillRect(225,10,60,25)
                this.infoCtx.fillStyle = "black"
                this.infoCtx.fillText(`$${_TOWERS[tower.type].buyCost}`, 275, 30)
                this.infoCtx.textAlign = "left";
               
                // EXISTING TOWER
            }else{
                this.infoCtx.textAlign = "left";
                this.infoCtx.fillText(`${tower.type} tower (Lv. ${tower.level})`, 25, 30)

                if(tower.type === "boostDamage" || tower.type === "boostRange"){
                    this.infoCtx.drawImage(this.bonusDamageIcon, 43, 35)
                    this.infoCtx.drawImage(this.bonusRangeIcon, 43, 75)
                    this.infoCtx.drawImage(this.rangeIcon, 51, 120)
                    this.infoCtx.fillText(`+ ${tower.bonusDamage} %`, 105, 72)
                    this.infoCtx.fillText(`+ ${tower.bonusRange}`, 105, 110)
                    this.infoCtx.fillText(`${tower.range}`, 105, 145)
                }
                else{
                    this.infoCtx.drawImage(this.damageIcon, 55, 52)
                    this.infoCtx.drawImage(this.extraDamageIcon, 51, 85)
                    this.infoCtx.drawImage(this.rangeIcon, 51, 120)
                    this.infoCtx.fillText(`${tower.type} tower (Lv. ${tower.level})`, 25, 30)
                    this.infoCtx.fillText(`${tower.finalDamage}`, 105, 72)
                    this.infoCtx.fillText(`${tower.finalSecondaryDamage}`, 105, 110)
                    this.infoCtx.fillText(`${tower.finalRange}`, 105, 145)
                }
            }
            
            
            
            if(upgrade){
                this.infoCtx.fillStyle = "#00ff00"
                if(tower.type !== "boostDamage" && tower.type !== "boostRange"){
                    this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeDamage}`, 175, 72)
                    this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeSecondaryDamage}`, 175, 112)
                    this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeRange}`, 175, 152)
                }
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


            let imgSrc = _TOWERS[tower].type + "TowerIcon"
            button.style.backgroundImage = `URL(${_PATHS[imgSrc]})`
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