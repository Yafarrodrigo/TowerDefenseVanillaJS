export default class Enemy{

    constructor(game, x, y, health, direction, speed){
        this.game = game
        this.id = this.game.IdGen.randomId()
        this.waypoints = game.map.road
        this.x = x
        this.y = y
        this.health = health
        this.maxHealth = health
        this.direction = direction
        this.statuses = []
        this.maxSpeed = speed
        this.currentSpeed = speed
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

    checkIfDead(){
        if(this.spawned === true){
            if(this.x > this.game.width || this.y > this.game.heigth){
                this.death(true)
            }
            else if(this.health <= 0){
                this.death(false)
            }
            else return
        }
    }

    death(outOfBounds){

        // DIE INSIDE MAP
        if(this.dead === false && outOfBounds === false){
            this.dead = true
            this.game.player.addMoney(5)
        }
        // DIE OUTSIDE MAP
        else if (this.dead === false && outOfBounds === true){
            this.dead = true
            this.game.player.removeLives(1)
            return
        }

        // IF ANY TOWER HAS THIS AS ENEMY, NULL THAT
        this.game.activeTowers.forEach((tower)=>{
            if(tower.target === this.id){
                tower.target = null
            }
        })

    }

    applyStatus(newStatus){

        if(this.checkStatus(newStatus.type) === false){
            this.statuses.push(newStatus)
        }
    }

    checkStatus(statusType){
        let found = false
        if(this.statuses.length < 1) return false
        this.statuses.forEach((status)=>{
            if(status.type === statusType){
                found = true
            }
        })
        
        if(found) return true
        else return false
    }

    removeStatus(statusToRemove){
        this.statuses = this.statuses.filter((status)=>{
            if(status.type !== statusToRemove) return true
        })
    }

    statusesEffect(){
        if(this.statuses.length < 1) {
            this.currentSpeed = this.maxSpeed
            return
        }
        this.statuses.forEach((status)=>{

            if(status.type === "stop"){
                this.currentSpeed = 0  
            }
            else if(status.type === "slow"){
                this.currentSpeed = parseFloat(((this.maxSpeed*100 - status.qtySlow*100)/100).toFixed(2))  
            }else{
                this.currentSpeed = this.maxSpeed
            }
        })
        
    }
    
    update(){


        let pointA = this.waypoints[this.currentWaypoint]
        let pointB = this.waypoints[this.targetWaypoint]
        
        // CHECK IF NEXT WAYPOINT
        if(this.direction === "right" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.x > (pointB[0] * this.game.map.tileSize) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === "down" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.y > (pointB[1] * this.game.map.tileSize) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === "up" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.y < (pointB[1] * this.game.map.tileSize) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === "left" && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.x < (pointB[0] * this.game.map.tileSize) +12){
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

        
        if(this.dead === false){
            this.statusesEffect()
        }

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