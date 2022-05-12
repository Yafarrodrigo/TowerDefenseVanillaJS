export default class Enemy{
    id = Math.floor(Math.random()*10000)

    constructor(game,id, x, y, health, direction, speed){
        this.game = game
        this.id = id
        this.waypoints = game.map.road
        this.x = x
        this.y = y
        this.health = health
        this.maxHealth = health
        this.direction = direction
        this.maxSpeed = speed
        this.currentSpeed = speed
        this.currentWaypoint = 0
        this.targetWaypoint = 1
        this.dead = false
        this.spawned = false
        this.stopped = false
        this.towerAttacking = null
    }   

    changeDirection(pointA, pointB){

        if(this.stopped === false) return

        if(pointA[1] === pointB[1]){
            // second waypoint is to the right?
            if(pointB[0] > pointA[0]){
                this.direction = "right"
                this.stopped = false
            }
            // left
            else{
                this.direction = "left"
                this.stopped = false
            }
        }
        // VERTICAL
        else if(pointA[0] === pointB[0]){
            // second waypoint is lower?
            if(pointB[1] > pointA[1]){
                this.direction = "down"
                this.stopped = false
            }
            // up
            else{
                this.direction = "up"
                this.stopped = false
            }
        }
    }

    checkIfDead(){
        if(this.spawned === true){
            if(this.x > 800 || this.y > 600){
                this.death(true)
            }
            else if(this.health <= 0){
                this.death(false)
                this.game.player.money += 5
                this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`
            }
            else return
        }
    }

    death(outOfBounds){
        this.game.stopClock()
        this.dead = true
        this.game.activeEnemies = this.game.activeEnemies.filter((el)=>{
            if(el.id !== this.id) return true
        })
        for(let i = 0; i < this.game.activeEnemies.length; i++){
            this.game.activeEnemies[i].id = i
        }

        this.game.activeTowers.forEach((tower)=>{
            if(tower.target === this.id){
                tower.target = null
            }
        })

        if(outOfBounds === true){
            this.game.player.lives -= 1
            this.game.infoPanel.lives.innerText = `LIVES: ${this.game.player.lives}`
            this.game.startClock()
            return
        }
        
        this.game.startClock()
    }

    checkIfSlowed(){
        if(this.towerAttacking === null){
            this.currentSpeed = this.maxSpeed
        }else{
            if(this.towerAttacking.type === "slow"){
                
                if((this.maxSpeed - this.towerAttacking.slow) > 0.15){
                    this.currentSpeed = this.maxSpeed - this.towerAttacking.slow
                }
            }else{
                this.currentSpeed = this.maxSpeed
            }
        }
    }
    
    update(){

        let pointA = this.waypoints[this.currentWaypoint]
        let pointB = this.waypoints[this.targetWaypoint]
        
        // CHECK IF NEXT WAYPOINT
        if(this.direction === "right" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.x > (pointB[0] * 50) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === "down" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.y > (pointB[1] * 50) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === "up" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.y < (pointB[1] * 50) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === "left" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.x < (pointB[0] * 50) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }

        if(this.stopped === true){
            this.changeDirection(pointA,pointB)
            return
        }

        this.checkIfSlowed()

        // MOVE
        if(this.direction === "right"){
            this.x += this.currentSpeed
        }
        else if(this.direction === "left"){
            this.x -= this.currentSpeed
        }
        else if(this.direction === "up"){
            this.y -= this.currentSpeed
        }
        else if(this.direction === "down"){
            this.y += this.currentSpeed
        }
        else return
    }
}