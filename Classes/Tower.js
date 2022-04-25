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
    }

    upgrade(){
        this.range += 10
        this.damgage += 1
    }

    shoot(){
        if(this.game.activeEnemies[this.target].dead === false){
            this.game.activeEnemies[this.target].health -= 1
        }else{
            this.target = null
        }
    }

    targetNearestEnemy(){
        if(this.target === null){
            let posibleTargets = []
            this.game.activeEnemies.forEach((enemy)=>{
                let distance = this.distance(this.x+12,enemy.x+12,this.y+12,enemy.y+12)
                if( distance < this.range  && enemy.dead === false){
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
                this.target = candidate.enemy.id
            }
        }
        else{
            if(this.distance(this.x,this.game.activeEnemies[this.target].x + 25,this.y,this.game.activeEnemies[this.target].y + 25) >= this.range){
                    this.target = null
                }
        }
    }

    distance(x0,x1,y0,y1){
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
    }
}
