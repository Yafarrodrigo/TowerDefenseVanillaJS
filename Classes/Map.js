export default class Map{

    tiles = []
    road = [[0,5],[5,5],[5,1],[10,1],[10,8],[5,8],[5,11]]

    constructor(game){
        this.game = game
    }

    create(){

        let bigArray = []
        for(let x = 0; x < 16; x++){
            let midArray = []
            for(let y = 0; y < 12; y++){
                
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
                    for(let x = 0; x < 16; x++){
                        for(let y = 0; y < 12; y++){
                            if(y > py && y <= p2y){
                                this.tiles[px][y].road = true
                            }
                        }
                    }
                }else{
                    for(let x = 0; x < 16; x++){
                        for(let y = 0; y < 12; y++){
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
                    for(let x = 0; x < 16; x++){
                        for(let y = 0; y < 12; y++){
                            if(x > px && x <= p2x){
                                this.tiles[x][py].road = true
                            }
                        }
                    }
                }else{
                    for(let x = 0; x < 16; x++){
                        for(let y = 0; y < 12; y++){
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

    changeTile(x, y, color){
        this.ctx.fillStyle = color
        if(color === "white"){this.tiles[x][y].isRoad = true}
        this.tiles[x][y].color = color
        this.ctx.fillRect((x*50)+1,(y*50)+1,49,49)
    }
}

// [[0,1],[3,1],[3,8],[10,8],[10,3],[14,3],[14,9],[15,9]]
// [[0,5],[5,5],[5,1],[10,1],[10,8],[5,8],[5,11]]