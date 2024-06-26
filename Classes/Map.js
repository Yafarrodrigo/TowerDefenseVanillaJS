import allMaps from '../allMaps.js'

export default class Map{

    qtyTilesX = 15
    qtyTilesY = 11
    tileSize = 50

    tiles = []

    constructor(game,road){
        this.game = game
        console.log(road);
        if(road instanceof Array){
            this.road = road
        }else{
            this.road = allMaps.find(map => map.id === road).road
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
                console.log('error in MAP');
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

// TEST VERTICAL
// [[4,0],[4,11]]

// TEST VERTICAL 2
// [[4,11],[4,0]]

// TEST RIGHT 2 LEFT
// [[15,6],[5,6],[5,10],[12,10],[12,2],[0,2]]