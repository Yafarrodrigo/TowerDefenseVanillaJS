export default class Bullet{
    constructor(tower, target){
        this.target = target
        this.tower = tower
        this.x = tower.x *50 +12
        this.y = tower.y *50 +12
    }

    update(){
        if(this.target !== null){
            return
        }
    }
}