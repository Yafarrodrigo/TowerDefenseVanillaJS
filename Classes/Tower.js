export default class Tower{
    id = Math.floor(Math.random()*10000)
    constructor(game,x, y, type){
        this.game = game
        this.x = (x * 50) + 25
        this.y = (y * 50) + 25
        this.type = type
        this.target = null
        this.range = 100
        this.damage = 1
        this.level = 1
        this.showRadius = false
        this.sellPrice = 0
        if(type === "slow"){
            this.slow = 0.5
        }
    }

    create(){
        this.tile = {
            x:(this.x -25) /50,
            y:(this.y -25 ) /50
        }
        let color
        switch(this.type){
            case "normal":
                color = "black"
                this.desc = "damages enemies"
                this.damage = 1
                break;
            
            case "slow":
                color = "lightblue"
                this.desc = "slows enemies"
                this.damage = 0.25
                break;
            
            default:
                color = "black"
                this.desc = "damages enemies"
                this.damage = 1
                break;
        }
        this.game.graphics.changeTile(this.tile.x, this.tile.y, color)
        this.game.map.tiles[this.tile.x][this.tile.y].tower = true

        if(this.type === "normal"){
            this.game.player.money -= 50
            this.sellPrice += 25
        }
        else if(this.type === "slow"){
            this.game.player.money -= 50
            this.sellPrice += 25
        }
        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`
        this.game.towerSelected = this
        this.game.infoPanel.updateTowerInfo(this)
    }

    upgrade(){
        if(this.level >= 10) return
        else this.level +=1

        if(this.type === "normal"){
            this.game.player.money -= 25
            this.sellPrice += 12
            this.range += 10
            this.damage += 0.5
        }
        else if(this.type === "slow"){
            this.game.player.money -= 75
            this.sellPrice += 12
            this.damage += 0.1
            this.slow += 0.25
        }

        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`
    }

    shoot(){

        let attackedEnemy = this.game.activeEnemies[this.target]

        if(attackedEnemy !== undefined && attackedEnemy !== null){
            if(this.game.activeEnemies[this.target].dead === false){
                if(attackedEnemy.towerAttacking === null || attackedEnemy.towerAttacking.type !== "slow") { attackedEnemy.towerAttacking = this }
                attackedEnemy.health -= this.damage
            }else{
                this.target = null
            }

            if(this.distance(this.x,attackedEnemy.x + 25,this.y,attackedEnemy.y + 25) >= this.range){
                attackedEnemy.towerAttacking = null
                this.target = null
            }
        }
        else{
            this.targetNearestEnemy()
        }
    }

    targetNearestEnemy(){
        if((this.target === null || this.target === undefined) ||
            this.game.activeEnemies[this.target] === null || this.game.activeEnemies[this.target] === undefined ){
            
            let posibleTargets = []

            this.game.activeEnemies.forEach((enemy)=>{
                let distance = this.distance(this.x+12,enemy.x+12,this.y+12,enemy.y+12)
                if( distance <= this.range  && enemy.dead === false){
                    posibleTargets.push({enemy, distance})
                }
            })
            if(posibleTargets.length !== 0){
                let candidate = posibleTargets[0]

                posibleTargets.forEach((target)=>{
                    if(target.distance < candidate.distance) {
                        candidate = target
                    }
                })
                if(this.game.activeEnemies.length !== 0){
                    if(this.game.activeEnemies[candidate.enemy.id] !== null || this.game.activeEnemies[candidate.enemy.id] !== undefined){
                        this.target = candidate.enemy.id
                    }else{
                        this.target = null
                    }
                }
            }
            else return
        }
        else{
            let attackedEnemy = this.game.activeEnemies[this.target]

            if(this.game.activeEnemies.length !== 0 && attackedEnemy !== undefined){
                if(this.distance(this.x,attackedEnemy.x + 25,attackedEnemy.y + 25) > this.range){
                    attackedEnemy.towerAttacking = null
                    this.target = null
                }
            }
        }
    }

    distance(x0,x1,y0,y1){
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
    }
}
