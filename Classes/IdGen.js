export default class IdGen{

    idCounter = 0

    randomId(){
        this.idCounter++
        return this.idCounter
    }
}