export default class Enemy{

    constructor(game, x, y, health, direction, speed, reward){
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
        this.reward = reward
        this.animationStep = 0
        this.attacker = null
        this.alreadyEnteredMap = false
    }   

    changeDirection(pointA, pointB){

        if(this.stopped === false) return

        if(pointA[1] === pointB[1]){
            // second waypoint is to the right?
            if(pointB[0] > pointA[0]){
                this.direction = 'right'
                this.stopped = false
            }
            // left
            else{
                this.direction = 'left'
                this.stopped = false
            }
        }
        // VERTICAL
        else if(pointA[0] === pointB[0]){
            // second waypoint is lower?
            if(pointB[1] > pointA[1]){
                this.direction = 'down'
                this.stopped = false
            }
            // up
            else{
                this.direction = 'up'
                this.stopped = false
            }
        }
    }

    checkIfDead(){
        if(this.spawned === true){
            if(this.x > this.game.width+25 || this.y > this.game.heigth+25 || this.x < -25 || this.y < -25){
                if(this.alreadyEnteredMap === true){
                    this.death(true)
                }
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
            this.game.player.addMoney(this.reward)

            // check masteries !
            if(this.game.masteries.check('laserCreditsMastery') && this.attacker.type === 'laser'){
                this.game.player.addMoney(1)
            }
            else if(this.game.masteries.check('AoECreditsMastery') && this.attacker.type === 'aoe'){
                this.game.player.addMoney(2)
            }
            else if(this.game.masteries.check('sniperCreditsMastery') && this.attacker.type === 'sniper'){
                this.game.player.addMoney(3)
            }

            if(this.game.masteries.check('sniperLifeMastery') && this.attacker.type === 'sniper'){
                this.game.player.addLives(1)
            }

        }
        // DIE OUTSIDE MAP
        else if (this.dead === false && outOfBounds === true){
            this.dead = true

            //check masteries
            if(this.game.masteries.check('creditsBeforeLifeMastery')){
                if(this.game.player.money - 5 >= 0){
                    this.game.player.removeMoney(5)
                }else{
                    this.game.player.removeLives(1)
                }
            }else{
                this.game.player.removeLives(1)
            }
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

            if(status.type === 'stop'){
                this.currentSpeed = 0  
            }
            else if(status.type === 'slow'){
                this.currentSpeed = parseFloat(((this.maxSpeed*100 - status.qtySlow*100)/100).toFixed(2))  
            }else{
                this.currentSpeed = this.maxSpeed
            }
        })
        
    }

    distance(x0,x1,y0,y1){
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
    }
    
    update(){

        if(this.alreadyEnteredMap === false){
            if(this.x > 0 && this.x < this.game.width && this.y > 0 && this.y < this.game.heigth){
                this.alreadyEnteredMap = true
            }
        }

        if(this.checkStatus('stop') === false){
            if(this.checkStatus('slow')){
                if(this.game.animationClock % 4 === 0){
                    if(this.animationStep >= 5){
                        this.animationStep = 0
                    }else{
                        this.animationStep++
                    }
                }
            }
            else{
                if(this.game.animationClock % 2 === 0){
                    if(this.animationStep >= 5){
                        this.animationStep = 0
                    }else{
                        this.animationStep++
                    }
                }
            }
        }

        this.statuses.forEach((status)=>{
            if(this.distance(this.x,status.tower.x, this.y, status.tower.y) > status.tower.finalRange){
                this.removeStatus('slow')
            }
        })

        let pointA = this.waypoints[this.currentWaypoint]
        let pointB = this.waypoints[this.targetWaypoint]
        
        // CHECK IF NEXT WAYPOINT
        if(this.direction === 'right' && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.x > (pointB[0] * this.game.map.tileSize) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === 'down' && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.y > (pointB[1] * this.game.map.tileSize) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === 'up' && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
            if(this.y < (pointB[1] * this.game.map.tileSize) +12){
                if((this.targetWaypoint + 1) <= this.waypoints.length-1){
                    this.targetWaypoint += 1
                    this.currentWaypoint += 1
                }
                this.stopped = true
                return
            }
        }
        else if(this.direction === 'left' && this.targetWaypoint !== this.waypoints.length-1 && this.stopped === false){
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
        if(this.direction === 'right'){
            this.x += this.currentSpeed
        }
        else if(this.direction === 'left'){
            this.x -= this.currentSpeed
        }
        else if(this.direction === 'up'){
            this.y -= this.currentSpeed
        }
        else if(this.direction === 'down'){
            this.y += this.currentSpeed
        }
        else return
    }
}