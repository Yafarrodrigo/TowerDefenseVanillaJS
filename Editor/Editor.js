import EditorGraphics from "./EditorGraphics.js";
import EditorMap from "./EditorMap.js";

export default class Editor{
    constructor(){
        this.map = new EditorMap()
        this.graphics = null
    }

    start(){
        this.map.create()
        this.graphics = new EditorGraphics(this.map)
        setTimeout(()=>{
            this.graphics.update()
        },100)
    }
}