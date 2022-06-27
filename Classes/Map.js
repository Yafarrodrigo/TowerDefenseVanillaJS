const roads = [
    [[0,2],[12,2],[12,10],[5,10],[5,6],[15,6]],
    [[0,1],[3,1],[3,8],[10,8],[10,3],[14,3],[14,9],[15,9]],
    [[0,5],[5,5],[5,1],[10,1],[10,8],[5,8],[5,11]]
]

export default class Map{

    qtyTilesX = 15
    qtyTilesY = 11
    tileSize = 50

    tiles = []
    road = roads[0]

    constructor(game){
        this.game = game
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
                
                let newTile = {x:x, y:y, color: "grey", road: false, tower: false}  
                midArray.push(newTile)
            }
            bigArray.push(midArray)
        }
        this.tiles = bigArray


        for(let i = 0; i < this.road.length-1; i++){
            const px = this.road[i][0]
            const py = this.road[i][1]
            const p2x = this.road[i+1][0]
            const p2y = this.road[i+1][1]

            this.tiles[px][py].road = true

            // VERTICAL
            if(px === p2x){
                if(py <= p2y){
                    for(let x = 0; x <= this.qtyTilesX; x++){
                        for(let y = 0; y <= this.qtyTilesY; y++){
                            if(y > py && y <= p2y){
                                this.tiles[px][y].road = true
                            }
                        }
                    }
                }else{
                    for(let x = 0; x <= this.qtyTilesX; x++){
                        for(let y = 0; y <= this.qtyTilesY; y++){
                            if(y <= py && y > p2y){
                                this.tiles[px][y].road = true
                            }
                        }
                    }
                }

            }
            // HORIZONTAL
            else if (py === p2y){
                if(px <= p2x){
                    for(let x = 0; x <= this.qtyTilesX; x++){
                        for(let y = 0; y <= this.qtyTilesY; y++){
                            if(x > px && x <= p2x){
                                this.tiles[x][py].road = true
                            }
                        }
                    }
                }else{
                    for(let x = 0; x <= this.qtyTilesX; x++){
                        for(let y = 0; y <= this.qtyTilesY; y++){
                            if(x <= px && x > p2x){
                                this.tiles[x][py].road = true
                            }
                        }
                    }
                }
            }
                            
            else{
                console.log("error");
            }
        }
    }
}
// EASY
// [0,2],[12,2],[12,10],[5,10],[5,6],[15,6]

// NO ME ACUERDO
// [[0,1],[3,1],[3,8],[10,8],[10,3],[14,3],[14,9],[15,9]]

// NO ME ACUERDO
// [[0,5],[5,5],[5,1],[10,1],[10,8],[5,8],[5,11]]