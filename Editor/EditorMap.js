import Road from "./Road.js"

export default class EditorMap{

    qtyTilesX = 15
    qtyTilesY = 11
    tileSize = 50

    tiles = []
    newRoad = new Road(this)
    history = []

    addHistory(){
        this.history.push({waypoints: [...this.newRoad.waypoints], size: this.newRoad.size, tiles: structuredClone(this.tiles)})
    }

    getLastHistory(){
        if(this.history.length > 0) return this.history[this.history.length-1]
        else return false
    }

    getSecondLastHistory(){
        if(this.history.length > 1) return this.history[this.history.length-2]
        else if (this.history.length === 1) return this.getLastHistory()
        else return false
    }

    removeLastHistory(qty = 1){
        if(this.getLastHistory() === false) return
        for(let i = 0; i < qty; i++){
            this.history.pop()
        }
    }

    checkForRoad(x,y){
        if(x >= 0 && x <= this.qtyTilesX && y >= 0 && y <= this.qtyTilesY){
            if(this.tiles[x][y].road === true){
                return true
            }else{
                return false
            }
        }
    }

    create(){
        let bigArray = []
        for(let x = 0; x <= this.qtyTilesX; x++){
            let midArray = []
            for(let y = 0; y <= this.qtyTilesY; y++){
                
                let newTile = {x:x, y:y, color: 'grey', road: false, tower: false}  
                midArray.push(newTile)
            }
            bigArray.push(midArray)
        }
        this.tiles = bigArray
    }
}
