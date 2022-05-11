import Game from "./Classes/Game.js"


const game = new Game()
game.map.create()

game.player.addListeners()

game.startClock()
