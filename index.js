import Game from "./Classes/Game.js"


const game = new Game()
game.map.create()

game.graphics.createBg()
game.graphics.createRoad()
game.player.addListeners()

game.startClock()

