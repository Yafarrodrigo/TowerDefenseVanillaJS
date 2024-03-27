import EditorGraphics from "./EditorGraphics.js";
import EditorMap from "./EditorMap.js";

export default class Editor{
    constructor(){
        this.map = new EditorMap()
        this.graphics = null
        this.cursorAt = {x:0,y:0}
        this.placingTile = true
        this.placingTileType = 'road'
        this.history = []
        this.done = false
    }

    start(){
        this.map.create()
        this.graphics = new EditorGraphics(this.map)
        this.createFloorTiles()
        this.addListeners()
        setInterval(()=>{
            this.graphics.update(this)
        },32)
    }

    addListeners(){
        this.graphics.canvas.addEventListener('click', (e)=>{
            e.preventDefault()
    
            const {x,y} = this.getMousePos(e)
            this.placeTile(x,y)
        })

        this.graphics.canvas.addEventListener('contextmenu', (e)=>{
            e.preventDefault()
    
            const {x,y} = this.getMousePos(e)
        })

        this.graphics.canvas.addEventListener('mousemove', (e)=>{
            e.preventDefault()
        
            const {x,y} = this.getMousePos(e)
        
            this.cursorAt.x = x
            this.cursorAt.y = y

            if(x < 0 || x > 800 || y < 0 || y > 600) return
        })
    }
    
    placeTile(x,y){
        if(this.placingTile === false) return
        // placing first tile
        if(this.map.newRoad.size === 0){
            if(x === 0 || x === 15 || y === 0 || y === 11){
                this.graphics.changeTile(x,y,this.placingTileType)
                this.map.newRoad.addNode(x,y)
                this.map.newRoad.addWaypoint(x,y)
                this.map.tiles[x][y].type = this.placingTileType
                this.map.tiles[x][y].road = 'road'
            }
         // if last
        }else if(this.map.newRoad.size > 1 && (x === 0 || x === 15 || y === 0 || y === 11)){
            const lastPoint = this.map.newRoad.getLastNode()
            // check for adjacents
            if(x !== lastPoint.x && y !== lastPoint.y) return
            
            this.graphics.changeTile(x,y,this.placingTileType)
            this.map.tiles[x][y].type = this.placingTileType
            this.map.tiles[x][y].road = 'road'
            this.placingTile = false
            this.done = true
            this.addTilesBetweenPoints([lastPoint.x,lastPoint.y],[x,y])
            this.map.newRoad.addWaypoint(x,y)
        }else{
            // seond one not in finish line
            if(this.map.newRoad.size === 1 && (x === 0 || x === 15 || y === 0 || y === 11)) return
            // rest
            const lastPoint = this.map.newRoad.getLastNode()
            if(x === lastPoint.x || y === lastPoint.y){

                let tileFound = false
                // check for adjacents
                for(let i = x-1; i <= x+1; i++){
                    for(let j = y-1; j <= y+1; j++){
                        if(this.map.newRoad.getNodeAt(i,j) !== false || ((x+1 === lastPoint.x || x-1 === lastPoint.x || y+1 === lastPoint.y || y-1 === lastPoint.y))){
                            tileFound = true
                        }
                    }
                }
                if(tileFound) return

                this.graphics.changeTile(x,y,this.placingTileType)
                this.map.tiles[x][y].type = this.placingTileType
                this.map.tiles[x][y].road = 'road'
                

                this.addTilesBetweenPoints([lastPoint.x,lastPoint.y],[x,y])

                const newLast = this.map.newRoad.getLastNode()
                this.map.newRoad.addWaypoint(newLast.x,newLast.y)
            }
        }
    }


    addTilesBetweenPoints(firstPoint, secondPoint){
        // VERTICAL
        if(firstPoint[0] === secondPoint[0]){
            if(secondPoint[1] >= firstPoint[1]){    //  y2 > y1
                for(let j = 1; j <= Math.abs(secondPoint[1]-firstPoint[1]); j++){
                    this.map.tiles[firstPoint[0]][firstPoint[1]+j].type = 'road'
                    this.map.tiles[firstPoint[0]][firstPoint[1]+j].road = true
                    this.map.newRoad.addNode(firstPoint[0],firstPoint[1]+j)
                }
            }else{
                for(let j = Math.abs(secondPoint[1]-firstPoint[1]); j >= 0; j--){
                    this.map.tiles[secondPoint[0]][secondPoint[1]+j].type = 'road'
                    this.map.tiles[secondPoint[0]][secondPoint[1]+j].road = true
                    this.map.newRoad.addNode(secondPoint[0],secondPoint[1]+j)
                }
            }
        }
        // HORIZONTAL
        else if (firstPoint[1] === secondPoint[1]){
            if(secondPoint[0] >= firstPoint[0]){
                for(let j = 1; j <= Math.abs(secondPoint[0]-firstPoint[0]); j++){
                    this.map.tiles[firstPoint[0]+j][firstPoint[1]].type = 'road'
                    this.map.tiles[firstPoint[0]+j][firstPoint[1]].road = true
                    this.map.newRoad.addNode(firstPoint[0]+j,firstPoint[1])
                }
            }else{
                for(let j = Math.abs(secondPoint[0]-firstPoint[0]); j >= 0 ; j--){
                    this.map.tiles[secondPoint[0]+j][secondPoint[1]].type = 'road'
                    this.map.tiles[secondPoint[0]+j][secondPoint[1]].road = true
                    this.map.newRoad.addNode(secondPoint[0]+j,secondPoint[1])
                }
            }
        }
    }

    // TODO
        /* 
         ERROR LAST TILE
        */
    getMousePos(evt){
        const rect = this.graphics.extraCanvas.getBoundingClientRect();

        const widthScale = canvas.width / rect.width;
        const heightScale = canvas.height / rect.height;

        let [x,y] = [Math.floor(((evt.clientX - rect.left) * widthScale)/this.map.tileSize),
                        Math.floor(((evt.clientY - rect.top) * heightScale)/this.map.tileSize)]

        if(x < 0) x = 0
        else if ( x > this.map.qtyTilesX ) x = this.map.qtyTilesX
        else if ( y < 0 )  y = 0
        else if ( y > this.map.qtyTilesY ) y = this.map.qtyTilesY

        return{x,y}
    }

    createFloorTiles(){
        const container = document.getElementById('floorButtons')
        const _TILES = ['road']

        for(const tile of _TILES){

            const button = document.createElement('button')
            button.id = tile.type
            button.classList.add('tileButton')
            if(tile === 'road'){
                button.classList.add('tileSelected')
            }

            button.addEventListener('click', (e) => {
                e.preventDefault()
                document.querySelectorAll('.tileButton').forEach( elem => {
                    elem.classList.remove('tileSelected')
                })
                button.classList.add('tileSelected')
                this.placingTileType = tile
            })

            let imgSrc
            switch(tile){
                case 'floor':
                    imgSrc = this.graphics.floorTile.src
                    break;
                case 'road':
                    imgSrc = this.graphics.roadFloor.src
                    break;

                default: imgSrc = this.graphics.floorTile
            }

            button.style.backgroundImage = `URL(${imgSrc})`
            container.append(button)
        }
    }
}