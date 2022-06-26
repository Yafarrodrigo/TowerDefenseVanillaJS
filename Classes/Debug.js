export default class Debug{
    constructor(game){
        this.game = game

        this.speedMinusButton = document.getElementById("debug-speed-minus")
        this.speedPlusButton = document.getElementById("debug-speed-plus")
        this.speedResetButton = document.getElementById("debug-speed-reset")
        this.playPauseButtom = document.getElementById("debug-play-pause")
        
        this.gameSpeedPanel = document.getElementById("debugSpeedMenu")
        this.gameSpeedInfo = document.getElementById("gameSpeed")   
        
        this.playPauseButtom.addEventListener("click", (e) => this.pauseOrPlay(e))
        this.speedMinusButton.addEventListener("click", (e)=> this.decreaseGameSpeed(e))
        this.speedPlusButton.addEventListener("click", (e)=> this.increaseGameSpeed(e))
        this.speedResetButton.addEventListener("click", (e)=> this.resetGameSpeed(e))
        
    }

    pauseOrPlay(e){
        e.preventDefault()
        if(this.game.paused === false){
            this.game.paused = true
            this.game.stopClock()
        }
        else{
            this.game.paused = false
            this.game.startClock(this.game.oldUpdateInterval)
        }
    }
    
    increaseGameSpeed(e){
        e.preventDefault()
        if((this.game.updateInterval / 2) >= 1){
            this.game.stopClock()
            this.game.oldUpdateInterval = this.game.updateInterval
            this.game.updateInterval /= 2
            this.gameSpeedInfo.innerHTML = `${ ((16*100) / this.game.updateInterval)}%`
            this.game.startClock()
        }
    }

    decreaseGameSpeed(e){
        e.preventDefault()
        if((this.game.updateInterval * 2) < 65){
            this.game.stopClock()
            this.game.oldUpdateInterval = this.game.updateInterval
            this.game.updateInterval *= 2
            this.gameSpeedInfo.innerHTML = `${ ((16*100) / this.game.updateInterval)}%`
            this.game.startClock()
        }
    }

    resetGameSpeed(e){
        e.preventDefault()
        this.game.stopClock()
        this.game.oldUpdateInterval = 16
        this.game.updateInterval = 16
        this.gameSpeedInfo.innerHTML = `${ ((16*100) / this.game.updateInterval)}%`
        this.game.startClock()
    }

    update(){
        if(this.game.debugMode === true){
            if(this.gameSpeedPanel.hidden === true){
                this.gameSpeedPanel.hidden = false
                this.gameSpeedPanel.style.display = "flex"
            }
        }
        else{
            if(this.gameSpeedPanel.hidden === false){
                this.gameSpeedPanel.hidden = true
                this.gameSpeedPanel.style.display = "none"
            }
        }
    }
}