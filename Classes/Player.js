import _TOWERS from "../towersConfig.js"
import LaserTower from "./Towers/LaserTower.js"
import SlowTower from "./Towers/SlowTower.js"
import StopTower from "./Towers/StopTower.js"
import AoeTower from "./Towers/AoeTower.js"
import SniperTower from "./Towers/SniperTower.js"
import ChainLaserTower from "./Towers/ChainLaserTower.js"
import BoostDamageTower from "./Towers/BoostDamageTower.js"
import BoostRangeTower from "./Towers/BoostRangeTower.js"

export default class player{

    constructor(game){
        this.game = game
        this.lives = 10
        this.money = 100
    }

    addMoney(qty){
        this.money += qty
        this.game.infoPanel.updateHeader()
    }

    removeMoney(qty){
        this.money -= qty
        this.game.infoPanel.updateHeader()
    }

    addLives(qty){
        this.lives += qty
        this.game.infoPanel.updateHeader()
    }

    removeLives(qty){
        this.lives -= qty
        this.game.infoPanel.updateHeader()
    }

    addListeners(){

        // CREAR TORRES Y SELECCIONAR TORRES
        this.game.graphics.canvas.addEventListener("click", (e)=>{

            //const {x,y} = this.game.player.getMousePos(e)
            const {x,y} = this.game.cursorAt
            const type = this.game.placingTowerType

            // LOST GAME -> PLAY AGAIN
            if(this.game.lost === true){
                if((500 < (x*this.game.map.tileSize)+12 && (x*this.game.map.tileSize)+12 < 600) && 
                    (307 < (y*this.game.map.tileSize)+12 && (y*this.game.map.tileSize)+12 < 357)){

                       location.reload()
                   }   
               }            

                // CREATE
            if(this.game.map.checkForRoad(x, y) === false &&
                this.game.map.checkForTower(x,y) === false &&
                this.game.placingTower === true) {
                let newTower
                switch(type){
                    case "laser": newTower = new LaserTower(this.game, x, y); break;
                    case "slow": newTower = new SlowTower(this.game, x, y); break;
                    case "stop": newTower = new StopTower(this.game, x, y); break;
                    case "aoe": newTower = new AoeTower(this.game, x, y); break;
                    case "chainLaser": newTower = new ChainLaserTower(this.game, x, y); break;
                    case "sniper": newTower = new SniperTower(this.game, x, y); break;
                    case "boostDamage": newTower = new BoostDamageTower(this.game, x, y); break;
                    case "boostRange": newTower = new BoostRangeTower(this.game, x, y); break;
                    default: newTower = new LaserTower(this.game, x, y); break
                }
                this.game.activeTowers.push(newTower)
                newTower.create()
                this.game.placingTower = false
                this.game.placingTowerType = null

                // SELECT TOWER
            }else{
                this.game.placingTower = false
                this.game.placingTowerType = null
                if(this.game.map.checkForTower(x,y) === true && this.game.activeTowers.length !== 0){
                    this.game.activeTowers.forEach((tower)=>{
                        if(Math.floor(tower.x/this.game.map.tileSize) === x && Math.floor(tower.y/this.game.map.tileSize) === y){
                            this.game.towerSelected = tower
                            this.game.infoPanel.updateInfoDisplay(tower)
                        }
                    })
                    this.game.graphics.updateTowers()
                }
                else{
                    this.game.towerSelected = null
                    this.game.placingTower = false
                    this.game.placingTowerType = false
                    this.game.infoPanel.updateInfoDisplay()
                }
            }
        })

        // UPDATE CURSOR POSITION
        this.game.graphics.canvas.addEventListener("mousemove", (e)=>{
            e.preventDefault()
            e.stopPropagation()
        
            const {x,y} = this.game.player.getMousePos(e)
        
            this.game.cursorAt.x = x
            this.game.cursorAt.y = y
        
            if(x < 0 || x > 800 || y < 0 || y > 600) return
        
            this.game.activeTowers.forEach((tower)=>{
                tower.showRadius = false
                    if(this.game.map.checkForTower(x,y) === true && this.game.activeTowers.length !== 0){
                        if(Math.floor(tower.x/this.game.map.tileSize) === x && Math.floor(tower.y/this.game.map.tileSize) === y){
                            tower.showRadius = true
                            this.game.infoPanel.updateInfoDisplay(tower)
                        }
                    }
                    else{
                        if(this.game.towerSelected === null){
                            this.game.infoPanel.updateInfoDisplay()
                        }
                    }
                })
        
        })

        // DEBUG MODE (LETTER "D") 
        document.addEventListener("keypress", (e) => {
            if(e.code === "KeyD"){
                if(this.game.debugMode === true){
                    this.game.debugMode = false
                }else{
                    this.game.debugMode = true
                }
                this.game.debug.update()
            }
        })

        window.addEventListener('contextmenu',(e) => { 
            e.preventDefault(); 
            
            this.game.towerSelected = null
            this.game.placingTowerType = null
            this.game.placingTower = null
            this.game.infoPanel.updateInfoDisplay()

          }, false);
    }

    getMousePos(evt){
        const rect = this.game.graphics.extraCanvas.getBoundingClientRect();

        const widthScale = canvas.width / rect.width;
        const heightScale = canvas.height / rect.height;

        let [x,y] = [Math.floor(((evt.clientX - rect.left) * widthScale)/this.game.map.tileSize),
                        Math.floor(((evt.clientY - rect.top) * heightScale)/this.game.map.tileSize)]

        if(x < 0) x = 0
        else if ( x > this.game.map.qtyTilesX ) x = this.game.map.qtyTilesX
        else if ( y < 0 )  y = 0
        else if ( y > this.game.map.qtyTilesY ) y = this.game.map.qtyTilesY

        return{x,y}
    }

    checkIfMoney(buy, type){
        if(buy){
            if(this.money >= _TOWERS[type].buyCost) return true
            else return false
        }

        else{
            if(this.money >= _TOWERS[type].upgradePrice) return true
            else return false
        }
    }
}