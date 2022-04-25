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
        this.speed = speed
        this.currentWaypoint = 0
        this.targetWaypoint = 1
        this.dead = false
        this.spawned = false
        this.stopped = false
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
    
    update(){


        // DEAD ?
        if(this.x > 800 || this.y > 600){
            this.dead = true
            this.game.player.lives -= 1
            this.game.infoLives.innerText = `LIVES: ${this.game.player.lives}`
        }

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

        // MOVE
        if(this.direction === "right"){
            this.x += this.speed
        }
        else if(this.direction === "left"){
            this.x -= this.speed
        }
        else if(this.direction === "up"){
            this.y -= this.speed
        }
        else if(this.direction === "down"){
            this.y += this.speed
        }
        else return
    }
}