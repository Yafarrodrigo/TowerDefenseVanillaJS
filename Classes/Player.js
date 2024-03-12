import _TOWERS from '../towersConfig.js'
import LaserTower from './Towers/LaserTower.js'
import SlowTower from './Towers/SlowTower.js'
import StopTower from './Towers/StopTower.js'
import AoeTower from './Towers/AoeTower.js'
import SniperTower from './Towers/SniperTower.js'
import ChainLaserTower from './Towers/ChainLaserTower.js'
import BoostDamageTower from './Towers/BoostDamageTower.js'
import BoostRangeTower from './Towers/BoostRangeTower.js'

export default class player{

    constructor(game){
        this.game = game
        this.lives = 10
        this.money = 100
        this.keys = {
            shift: false
        }
    }

    addMoney(qty){
        if(this.money + qty > 999){
            this.money = 999
        }else{
            this.money += qty
        }
        this.game.infoPanel.updateHeader()
    }

    removeMoney(qty){
        this.money -= qty
        this.game.infoPanel.updateHeader()
    }

    addLives(qty){
        if(this.lives + qty > 100){
            this.lives = 100
        }else{
            this.lives += qty
        }
        this.game.infoPanel.updateHeader()
    }

    removeLives(qty){

        // check masteries !
        if(this.game.masteries.check('sacrificeMastery')){
            this.addMoney(1000)
        }
        this.lives -= qty
        this.game.infoPanel.updateHeader()
    }

    addListeners(){

        // CREAR TORRES Y SELECCIONAR TORRES
        this.game.graphics.canvas.addEventListener('click', (e)=>{

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
                    case 'laser': newTower = new LaserTower(this.game, x, y); break;
                    case 'slow': newTower = new SlowTower(this.game, x, y); break;
                    case 'stop': newTower = new StopTower(this.game, x, y); break;
                    case 'aoe': newTower = new AoeTower(this.game, x, y); break;
                    case 'chainLaser': newTower = new ChainLaserTower(this.game, x, y); break;
                    case 'sniper': newTower = new SniperTower(this.game, x, y); break;
                    case 'boostDamage': newTower = new BoostDamageTower(this.game, x, y); break;
                    case 'boostRange': newTower = new BoostRangeTower(this.game, x, y); break;
                    default: newTower = new LaserTower(this.game, x, y); break
                }
                this.game.activeTowers.push(newTower)
                newTower.create()

                if(this.keys.shift === false || this.money - _TOWERS[type].buyCost < 0){
                    this.game.placingTower = false
                    this.game.placingTowerType = null
                }

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
        this.game.graphics.canvas.addEventListener('mousemove', (e)=>{
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

        window.addEventListener('contextmenu',(e) => { 
            e.preventDefault(); 
            
            this.game.towerSelected = null
            this.game.placingTowerType = null
            this.game.placingTower = null
            this.game.infoPanel.updateInfoDisplay()

          }, false);

        document.addEventListener('keydown', (e) => {
            if(e.key === 'Shift'){
                this.keys['shift'] = true
            }
        })
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Shift'){
                this.keys['shift'] = false
            }
        })

        document.addEventListener('keypress', (e)=>{

            if(e.key === ' '){
                if(this.game.levelStarted === true){
                    this.game.debug.pauseOrPlay(e)
                }else{
                    this.game.levelStarted = true
                    this.game.infoPanel.startButton.innerText = 'Next Wave'
                }
                return
            }

            const nums = ['1','2','3','4','5','6','7','8']
            if(!nums.includes(e.key)) return

            this.game.placingTower = false
            this.game.placingTowerType = false
            this.game.towerSelected = null

            switch(e.key){
                case '1': this.game.infoPanel.buyTower(_TOWERS['laser'].type); break;
                case '2': this.game.infoPanel.buyTower(_TOWERS['slow'].type); break;
                case '3': this.game.infoPanel.buyTower(_TOWERS['aoe'].type); break;
                case '4': this.game.infoPanel.buyTower(_TOWERS['sniper'].type); break;
                case '5': this.game.infoPanel.buyTower(_TOWERS['chainLaser'].type); break;
                case '6': this.game.infoPanel.buyTower(_TOWERS['stop'].type); break;
                case '7': this.game.infoPanel.buyTower(_TOWERS['boostDamage'].type); break;
                case '8': this.game.infoPanel.buyTower(_TOWERS['boostRange'].type); break;
                default: this.game.infoPanel.buyTower(_TOWERS['laser'].type); break;
            }
        })
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