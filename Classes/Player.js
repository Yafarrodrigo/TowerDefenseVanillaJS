import _TOWERS from "../towersConfig.js"
import Tower from "./Tower.js"

export default class player{

    constructor(game){
        this.game = game
        this.lives = 10
        this.money = 100
    }

    addListeners(){

        // CREAR TORRES Y SELECCIONAR TORRES
        this.game.graphics.canvas.addEventListener("click", (e)=>{

            const {x,y} = this.game.player.getMousePos(e)
            const type = this.game.placingTowerType

            if(this.game.lost === true){
                if((500 < (x*50)+12 && (x*50)+12 < 600) && 
                    (307 < (y*50)+12 && (y*50)+12 < 357)){

                       location.reload()
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
                        if(Math.floor(tower.x/50) === x && Math.floor(tower.y/50) === y){
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

        let [x,y] = [Math.floor(((evt.clientX - rect.left) * widthScale)/50),
                        Math.floor(((evt.clientY - rect.top) * heightScale)/50)]

        if(x < 0) x = 0
        else if ( x > 15 ) x = 15
        else if ( y < 0 )  y = 0
        else if ( y > 11 ) y = 11

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