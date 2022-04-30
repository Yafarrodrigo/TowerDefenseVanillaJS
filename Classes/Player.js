import Tower from "./Tower.js"

export default class player{

    constructor(game){
        this.game = game
        this.lives = 10
        this.money = 100
    }

    addListeners(){
        
        // CREAR TORRES
        this.game.graphics.bgCanvas.addEventListener("click", (e)=>{

            const {x,y} = this.game.player.getMousePos(e)
            const type = document.querySelector("input[name='towerType']:checked").id

                // CREATE
            if(this.game.map.checkForRoad(x, y) === false &&
                this.game.map.checkForTower(x,y) === false &&
                this.game.player.checkIfMoney(true, type)) {

                let newTower = new Tower(this.game, x, y , type)
                this.game.activeTowers.push(newTower)
                newTower.create()

                // SELECT TOWER
            }else{
                
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
        this.game.graphics.bgCanvas.addEventListener("mousemove", (e)=>{
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

        document.addEventListener("keyup", (e)=>{
            e.preventDefault()
            e.stopPropagation()
            if(e.code  === "Space"){
                if(this.game.stopped === true){
                    this.game.stopped = false
                    this.game.startClock()
                }else{
                    this.game.stopped = true
                    this.game.stopClock()
                }
            }
        })
    }

    getMousePos(evt){
        const rect = this.game.graphics.fxCanvas.getBoundingClientRect();
        return {
            x: Math.floor((evt.clientX - rect.left)/50),
            y: Math.floor((evt.clientY - rect.top)/50)
        };
    }

    checkIfMoney(buy, type){
        switch(type){
            case "normal":
                if(buy){
                    if(this.money >= 50){
                        return true
                    }
                    else return false
                }else{
                    if(this.money >= 25){
                        return true
                    }
                    else return false
                }
                
            
            case "slow":
                if(buy){
                    if(this.money >= 50){
                        return true
                    }
                    else return false
                }else{
                    if(this.money >= 75){
                        return true
                    }
                    else return false
                }
        }

        return false
    }
}