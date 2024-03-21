export default class EditorMap{

    qtyTilesX = 15
    qtyTilesY = 11
    tileSize = 50

    tiles = []
    road = [[0,1],[14,1],[14,5],[1,5],[1,10],[15,10]]

    checkForRoad(x,y){
        if(x >= 0 && x <= this.qtyTilesX && y >= 0 && y <= this.qtyTilesY){
            if(this.tiles[x][y].road === true){
                return true
            }else{
                return false
            }
        }
    }

    checkForTower(x,y){
        if(x >= 0 && x <= this.qtyTilesX && y >= 0 && y <= this.qtyTilesY){
            if(this.tiles[x][y].tower === true){
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
