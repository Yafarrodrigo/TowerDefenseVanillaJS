export default class Road{
    constructor(map){
        this.firstTile = null
        this.size = 0
        this.waypoints = []
        this.map = map
    }

    addWaypoint(x,y){
        this.waypoints.push([x,y])
        this.map.addHistory()
        console.log(this.map.history[this.map.history.length-1].waypoints);
    }

    addNode(x,y){
        if(this.getNodeAt(x,y) !== false) return

        if(this.firstTile === null){
            this.firstTile = new TileNode(x,y,0)
        }else{
            const lastNode = this.getLastNode()
            lastNode.next = new TileNode(x,y,lastNode.index+1)
        }
        this.size += 1
    }

    getLastNode(){
        if(this.firstTile === null) return false
        if(this.firstTile.next === null) return this.firstTile
    
        let current = this.firstTile
        while(current.next !== null){
            current = current.next
        }
        return current
    }

    getNodeAt(x,y){
        if(this.firstTile === null) return false
        
        let current = this.firstTile

        while(current.next !== null){
            if(current.x === x && current.y === y) return current
            else current = current.next
        }

        return false
    }

    getRoad(){
        if(this.firstTile === null) return []
        if(this.firstTile.next === null) return [[this.firstTile.x,this.firstTile.y]]

        let result = []
    
        let current = this.firstTile
        result.push([this.firstTile.x,this.firstTile.y])
        
        while(current.next !== null){
            current = current.next
            result.push([current.x,current.y])
        }

        return result
    }

    getWaypoints(){
        return this.waypoints
    }
}

class TileNode{
    constructor(x,y, index){
        this.index = index
        this.x = x
        this.y = y
        this.next = null
    }
}