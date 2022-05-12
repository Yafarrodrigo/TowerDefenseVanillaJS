import _TOWERS from "../towersConfig.js"
import Bullet from "./Bullet.js"

export default class Tower{
    id = Math.floor(Math.random()*10000)
    constructor(game,x, y, type){
        this.game = game
        this.x = (x * 50) + 25
        this.y = (y * 50) + 25
        this.type = type
        this.target = null
        this.level = 1
        this.timer = 1
        this.showRadius = false
        this.sellPrice = 0

        this.damage = _TOWERS[type].damage
        this.secondaryDamage = _TOWERS[type].secondaryDamage
        this.range = _TOWERS[type].range
        this.color = _TOWERS[type].color
        this.description = _TOWERS[type].description
        this.projectiles = _TOWERS[type].projectiles
        this.slow = _TOWERS[type].slow

        this.buyCost = _TOWERS[type].buyCost
        this.upgradeCost = _TOWERS[type].upgradeCost
    }


    create(){
        this.tile = {
            x:(this.x -25) /50,
            y:(this.y -25 ) /50
        }
        this.game.graphics.changeTile(this.tile.x, this.tile.y, this.color)
        this.game.map.tiles[this.tile.x][this.tile.y].tower = true

        this.game.player.money -= this.buyCost
        this.sellPrice += Math.round(this.buyCost/2)

        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`
        this.game.towerSelected = this
        this.game.infoPanel.updateTowerInfo(this)
    }

    upgrade(){
        if(this.level >= 10) return
        else this.level +=1

        this.game.player.money -= _TOWERS[this.type].upgradeCost
        this.sellPrice += Math.round(_TOWERS[this.type].upgradeCost/2)

        this.damage += _TOWERS[this.type].upgradeDamage
        this.range += _TOWERS[this.type].upgradeRange
        this.slow += _TOWERS[this.type].upgradeSlow

        this.game.infoPanel.money.innerText = `PLATITA: ${this.game.player.money}`
    }

    shootProjectile(){
        let attackedEnemy = this.game.activeEnemies[this.target]
        if(attackedEnemy !== undefined && attackedEnemy !== null){
            
            if(attackedEnemy.dead === false){
                if(attackedEnemy.towerAttacking === null || attackedEnemy.towerAttacking.type !== "slow") { attackedEnemy.towerAttacking = this}
                const newBullet = new Bullet(this.game, this, attackedEnemy)
                this.game.activeBullets.push(newBullet)
            }else{
                this.target = null
            }


            if(this.distance(this.x,attackedEnemy.x + 25,this.y,attackedEnemy.y + 25) >= this.range){
                attackedEnemy.towerAttacking = null
                this.target = null
            }
        }else{
            this.targetNearestEnemy()
        }
    }

    shoot(){

        let attackedEnemy = this.game.activeEnemies[this.target]

        if(attackedEnemy !== undefined && attackedEnemy !== null){
            if(attackedEnemy.dead === false){
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
