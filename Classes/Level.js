export default class Level {
    constructor(game, id, qtyEnemies, enemyData){
        this.game = game
        this.id = id
        this.qtyEnemies = qtyEnemies
        this.enemyData = enemyData
    }

    isDone(){
        let counter = 0
        this.game.activeEnemies.forEach((enemy)=>{
            if(enemy.dead === true){
                counter++
            }
        })

        if(counter === this.qtyEnemies){
            return true
        }else{
            return false
        }
    }
}