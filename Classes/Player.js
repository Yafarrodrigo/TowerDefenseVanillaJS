import _TOWERS from "../towersConfig.js"
import Tower from "./Tower.js"

export default class player{

    constructor(game){
        this.game = game
        this.lives = 10
        this.money = 100
    }

    addListeners(){

        // CREAR TORRES
        this.game.graphics.canvas.addEventListener("click", (e)=>{

            const {x,y} = this.game.player.getMousePos(e)
            const type = document.querySelector("input[name='towerType']:checked").id

            if(this.game.lost === true){
                if((500 < (x*50)+12 && (x*50)+12 < 600) && 
                    (307 < (y*50)+12 && (y*50)+12 < 357)){

                       alert("Go!")
                   }   
               }
            

                // CREATE
            if(this.game.map.checkForRoad(x, y) === false &&
                this.game.map.checkForTower(x,y) === false &&
                this.game.placingTower === true) {

                let newTower = new Tower(this.game, x, y , type)
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
                        if(Math.floor(tower.x/50) === x && Math.floor(tower.y/50) === y){
                            this.game.infoPanel.updateTowerInfo(tower)
                            this.game.towerSelected = tower
                        }
                    })
                    this.game.graphics.updateTowers()
                }
                else{
                    this.game.towerSelected = null
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
        
        
            this.game.activeTowers.forEach((tower)=>{
                tower.showRadius = false
                    if(this.game.map.checkForTower(x,y) === true && this.game.activeTowers.length !== 0){
                        if(Math.floor(tower.x/50) === x && Math.floor(tower.y/50) === y){
                            tower.showRadius = true
                        }
                    }
                })
        
        })
    }

    getMousePos(evt){
        const rect = this.game.graphics.extraCanvas.getBoundingClientRect();
        return {
            x: Math.floor((evt.clientX - rect.left)/50),
            y: Math.floor((evt.clientY - rect.top)/50)
        };
    }

    checkIfMoney(buy, type){
        if(buy){
            if(this.money >= _TOWERS[type].buyCost) return true
            else return false
        }

        else{
            if(this.money >= _TOWERS[type].upgradeCost) return true
            else return false
        }
    }
}