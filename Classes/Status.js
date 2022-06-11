export default class Status{
    constructor(type, tower,qtySlow = 0, dmg = 0,){
        this.type = type,
        this.tower = tower
        this.qtySlow = qtySlow
        this.dmg = dmg
    }
}