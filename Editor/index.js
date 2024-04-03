import _PATHS from '../imgPaths.js'
import Editor from './Editor.js'

// GAME HELP 
const helpPages = [
    {number: 1, title:'Level Info', img: _PATHS.helpLevelInfo},
    {number: 2, title:'Lives and Credits', img: _PATHS.helpPlayerInfo},
    {number: 3, title:'Speed Control', img: _PATHS.helpSpeed},
    {number: 4, title:'Options', img: _PATHS.helpOptions},
    {number: 5, title:'Tower Stats', img: _PATHS.helpStats},
    {number: 6, title:'Upgrading & Selling Towers', img: _PATHS.helpUpgradeSell},
    {number: 7, title:'Brief towers description', img: _PATHS.helpTowers1},
    {number: 8, title:'Brief towers description', img: _PATHS.helpTowers2},
]
let currentPage = 1
const maxPage = helpPages.length
document.getElementById('helpPagination').innerText = currentPage + ' / ' + maxPage

document.getElementById('helpButtonBack').addEventListener('click', (e) => {
    (currentPage - 1) > 0 ? currentPage -= 1 : currentPage = 1
    document.getElementById('helpPagination').innerText = currentPage + ' / ' + maxPage
    document.getElementById('helpPageTitle').innerText = helpPages[currentPage-1].title
    document.getElementById('helpImage').src = helpPages[currentPage-1].img
})

document.getElementById('helpButtonNext').addEventListener('click', (e) => {
    (currentPage + 1) <= maxPage ? currentPage += 1 : currentPage = maxPage
    document.getElementById('helpPagination').innerText = currentPage + ' / ' + maxPage
    document.getElementById('helpPageTitle').innerText = helpPages[currentPage-1].title
    document.getElementById('helpImage').src = helpPages[currentPage-1].img
})

const helpButton = document.getElementById('help')
const helpContainer = document.getElementById('helpContainer')
const blackScreen = document.getElementById('fadeToBlack')
helpButton.addEventListener('click', (e)=>{
    e.preventDefault()
    
    blackScreen.classList.remove('notShown')
    blackScreen.classList.add('shown')

    helpContainer.classList.remove('notShown')
    helpContainer.classList.add('shown')
})

const helpCloseButton = document.getElementById('helpCloseButton')
helpCloseButton.addEventListener('click', (e) =>{
    e.preventDefault()
    blackScreen.classList.add('notShown')
    blackScreen.classList.remove('shown')

    helpContainer.classList.add('notShown')
    helpContainer.classList.remove('shown')
})

const editor = new Editor()
editor.start()

document.getElementById('startButton').addEventListener('click', (e) => {
    e.preventDefault()
    if(editor.done === false) return
    const mapToPlay = editor.map.newRoad.getWaypoints()
    localStorage.setItem('TD_MAP_INFO', JSON.stringify(mapToPlay))
    window.location.href = 'https://yafarrodrigo.github.io/index.html'
})