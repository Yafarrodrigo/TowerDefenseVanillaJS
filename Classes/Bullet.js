export default class Bullet{
    constructor(game, tower, target){
        this.game = game
        this.target = target
        this.tower = tower
        this.x = tower.x
        this.y = tower.y
        this.dead = false
    }

    calculateSpeed(x1,y1,x2,y2){
        const dx = x2 - x1
        const dy = y2 - y1

        const angle = Math.atan2(dy,dx)

        return {
            x: Math.abs(Math.cos(angle)) * 5,
            y: Math.abs(Math.sin(angle)) * 5
        }
    }

    distance(x0,x1,y0,y1){
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
    }

    hit(){
        if(this.distance(this.x,this.target.x, this.y,this.target.y) < 10){
            return true
        }else{
            return false
        }
    }

    damageNearEnemies(){
        let nearEnemies = []
        //  no enemies -> no problem
        if(this.game.activeEnemies.length === 0) return

        // check distance to other enemies
        this.game.activeEnemies.forEach((enemy)=>{
            if(this.distance(this.target.x,enemy.x,this.target.y,enemy.y) <= this.tower.aoeRadius
                && enemy.id !== this.target.id){ 
                
                    nearEnemies.push(enemy)
            }
        })

        // if nearby enemies -> damage them
        if(nearEnemies.length !== 0){
            nearEnemies.forEach((enemy)=>{
                if(enemy.health - this.tower.secondaryDamage >= 0){
                    enemy.health -= this.tower.secondaryDamage
                }else{
                    enemy.health = 0
                }
            })
        }
    }

    update(){
        if(this.game.activeEnemies.length === 0 || this.target.dead === true || 
            this.target === null || this.target === undefined ||
            this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.heigth){

                if(this.tower.type !== "projectiles"){
                    this.dead = true
                    return
                }
                else{
                    if(this.game.activeEnemies.length > 0){
                        this.target = this.tower.target
                    }
                    else{
                        this.dead = true
                        return
                    }
                }

                

        }else{

            if(this.hit()){
                if(this.tower.type === "aoe"){
                    this.damageNearEnemies()
                }

                if(this.target.health - this.tower.finalDamage >= 0){
                    this.target.health -= this.tower.finalDamage
                    
                }else{
                    this.target.health = 0
                }

                this.dead = true
                return
            }

            // MOVEMENT

            const {x,y} = this.calculateSpeed(this.x,this.y,this.target.x,this.target.y)

            if(this.x > this.target.x){
                this.x -= x
            }else{
                this.x += x
            }
        
            if(this.y > this.target.y){
                this.y -= y
            }else{
                this.y += y
            }
        }
    }
}