import _PATHS from "../imgPaths.js"
import _TOWERS from "../towersConfig.js"

export default class InfoPanel{
    level = document.getElementById("level")
    lives = document.getElementById("lives")
    money = document.getElementById("money")

    showRadiusCheckbox = document.getElementById("showRadius")
    autoNextLevelCheckbox = document.getElementById("autoNextLevel")
    startButton = document.getElementById("startButton")
    
    helpButton = document.getElementById("help")
    blackScreen = document.getElementById("fadeToBlack")
    showingHelp = false
    helpScreen = new Image()

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
        this.helpScreen.src = _PATHS.helpScreen
        this.helpScreen.style.opacity = "0"

        this.blackScreen.append(this.helpScreen)
        

        this.helpButton.addEventListener("click", (e)=>{
            e.preventDefault()
            if(this.showingHelp){
                this.blackScreen.style.opacity = "0"
                this.helpScreen.style.opacity = "0"
                this.blackScreen.style.pointerEvents = "none"
            }else{
                this.blackScreen.style.opacity = "0.75"
                this.helpScreen.style.opacity = "1"
                this.blackScreen.style.pointerEvents = "initial"
            }
        })

        this.blackScreen.addEventListener("click", (e)=> {
            this.blackScreen.style.opacity = "0"
            this.blackScreen.style.pointerEvents = "none"
        })

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

    displayUpgrade(tower, stat, x, y){
        this.infoCtx.textAlign = "left";
        this.infoCtx.fillStyle = "#00ff00"

        switch(stat){
            case "damage":
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeDamage}`, x, y)
                break

            case "extraDamage":
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeSecondaryDamage}`, x, y)
            break

            case "range":
                this.infoCtx.fillText(`+ ${_TOWERS[tower.type].upgradeRange}`, x, y)
            break

            case "description":
            console.log("description");
            break
        }
    }

    displayStat(tower, ref = false, stat, x, y){

        this.infoCtx.textAlign = "left";
        this.infoCtx.fillStyle = "white"

        switch(stat){
            case "type":
                if(ref) this.infoCtx.fillText(`${tower.type} tower`, x, y)
                else this.infoCtx.fillText(`${tower.type} tower (lv. ${tower.level})`, x, y)
                break

            case "buyCost":
                this.infoCtx.fillStyle = "lightgrey"
                this.infoCtx.fillRect(x+10, y, 60, 28)
                this.infoCtx.textAlign = "right";
                this.infoCtx.fillStyle = "black"
                this.infoCtx.fillText(`$${_TOWERS[tower.type].buyCost}`, x+60, y+20)
                break

            case "damage":
                this.infoCtx.drawImage(this.damageIcon, x-25, y-25)
                if(ref) this.infoCtx.fillText(`${tower.damage}`, x+25, y+9)
                else this.infoCtx.fillText(`${tower.finalDamage}`, x+25, y+9)
                break

            case "extraDamage":
                this.infoCtx.drawImage(this.extraDamageIcon, x-25, y-25)
                if(ref) this.infoCtx.fillText(`${tower.secondaryDamage}`, x+25, y+9)
                else this.infoCtx.fillText(`${tower.finalSecondaryDamage}`, x+25, y+9)
                break

            case "range":
                this.infoCtx.drawImage(this.rangeIcon, x-25, y-25)
                if(ref) this.infoCtx.fillText(`${tower.range}`, x+25, y+9)
                else this.infoCtx.fillText(`${tower.finalRange}`, x+25, y+9)
                break
            
            case "speed":
                this.infoCtx.drawImage(this.speedIcon, x-25, y-25)
                this.infoCtx.fillText(`${tower.speed}`, x+25, y+9)
                break

            case "boostDamage":
                this.infoCtx.drawImage(this.bonusDamageIcon, x-25, y-25)
                this.infoCtx.fillText(`+ ${tower.bonusDamage} %`, x+25, y+9)
                break

            case "boostRange":
                this.infoCtx.drawImage(this.bonusRangeIcon, x-25, y-25)
                this.infoCtx.fillText(`+ ${tower.bonusRange}`, x+25, y+9)
                break

            case "description":
                this.infoCtx.textAlign = "center";
                this.infoCtx.fillText(tower.description, x, y)
                break
            
            case "upgradeDescription":
                this.infoCtx.fillStyle = "#00ff00"
                this.infoCtx.textAlign = "center";
                this.infoCtx.fillText(tower.upgradeDescription, x, y)
                break
        }
    }

    updateInfoDisplay(tower, upgrade = false, buying = false){
        this.infoCtx.fillStyle = "#555"
        this.infoCtx.fillRect(0,0,300,200)
        this.infoCtx.font = "20px Coda";

        if(tower){
            if(buying === true){

                this.displayStat(tower, true, "type", 25, 30)
                
                if(tower.boosts){
                    this.displayStat(tower, true, "type",           25, 30)
                    this.displayStat(tower, true, "boostDamage",    40 ,75)
                    this.displayStat(tower, true, "boostRange",     180 ,75)
                    this.displayStat(tower, true, "range",          40 ,120)
                    this.displayStat(tower, true, "speed",          180, 120)
                }
                else{
                    this.displayStat(tower, true, "type",         25, 30)
                    this.displayStat(tower, true, "damage",       40, 75)
                    this.displayStat(tower, true, "extraDamage",  180, 75)
                    this.displayStat(tower, true, "range",        40, 120)
                    this.displayStat(tower, true, "speed",        180, 120)
                }
                this.displayStat(tower,true, "buyCost", 200, 10)
               
                // EXISTING TOWER
            }else{

                this.displayStat(tower,false, "type", 25,30)

                if(tower.boosts){
                    this.displayStat(tower, false, "type",           25, 30)
                    this.displayStat(tower, false, "boostDamage",    40 ,75)
                    this.displayStat(tower, false, "boostRange",     180 ,75)
                    this.displayStat(tower, false, "range",          40 ,120)
                    this.displayStat(tower, false, "speed",          180, 120)
                }
                else{
                    this.displayStat(tower, false, "type",         25, 30)
                    this.displayStat(tower, false, "damage",       40, 75)
                    this.displayStat(tower, false, "extraDamage",  180, 75)
                    this.displayStat(tower, false, "range",        40, 120)
                    this.displayStat(tower, false, "speed",        180, 120)
                }
            }
            
            if(upgrade){
                if(!tower.boosts){
                    this.displayUpgrade(tower, "damage", 110, 84)
                    this.displayUpgrade(tower, "extraDamage", 240, 84)
                    this.displayUpgrade(tower, "range", 110, 128)
                }
                if(tower.upgradeDescription !== null){
                    this.displayStat(tower, true, "upgradeDescription", (this.infoCanvas.width/2), 190)
                } 
                else{
                    this.displayStat(tower, true, "description", (this.infoCanvas.width/2), 190)
                }
            }
            else{
                this.displayStat(tower, true, "description", (this.infoCanvas.width/2), 190)
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


            const imgSrc = _PATHS[_TOWERS[tower].type + "TowerIcon"]
            button.style.backgroundImage = `URL(${imgSrc})`
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