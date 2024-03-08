export default class Tooltip{
    constructor(){
        this.elem = document.getElementById('tooltipDiv')
        this.elemsWithToolTip = ["levelInfo","masteriesOpenButton","lives","money",
                                "debug-play-pause","debug-speed-minus","debug-speed-plus",
                                "debug-speed-reset","help","showRadiusLabel","autoNextLevelLabel",
                                "startButton","towerInfo","upgradeTower","sellTower","laser","slow",
                                "aoe","sniper","chainLaser","stop","boostDamage","boostRange"]
        this.pos = [0,0]

        this.tooltipsTexts = {
            "levelInfo":            "The current Level and enemies hp and reward",
            "masteriesOpenButton":  "Open the Masteries panel",
            "lives":                "Current Lives",
            "money":                "Current Credits",
            "debug-play-pause":     "Pause the game (spacebar)",
            "debug-speed-minus":    "Slows down the game",
            "debug-speed-plus":     "Speeds up the game",
            "debug-speed-reset":    "Reset the speed of the game",
            "help":                 "Opens the help section",
            "showRadiusLabel":      "Toggle the radius indicator in all towers",
            "autoNextLevelLabel":   "Enable to send next wave automatically when current finish",
            "startButton":          "Starts the game or sends the next wave (spacebar)",
            "towerInfo":            "Shows damage, range and info about the selected tower",
            "upgradeTower":         "Upgrades the selected tower",
            "sellTower":            "Sells the selected tower",
            "laser":                "Shoots lasers (num 1)",
            "slow":                 "Slows enemies (num 2)",
            "aoe":                  "Damages enemies in an area (num 3)",
            "sniper":               "Shoots slow but has high damage (num 4)",
            "chainLaser":           "Shoots lasers that bounce on nearby enemies (num 5)",
            "stop":                 "Stops an enemy for a short duration (num 6)",
            "boostDamage":          "Boosts other towers damage (num 7)",
            "boostRange":           "Boosts other towers range (num 8)"
        }

        this.elemsWithToolTip.forEach( elem => {

            document.getElementById(elem).classList.add('elemWithTooltip')
            document.getElementById(elem).addEventListener('mousemove', (e)=>{
                e.preventDefault()

                this.elem.style.left = e.clientX + 25 + 'px'
                this.elem.style.top = e.clientY + 25 + 'px'
            })
            document.getElementById(elem).addEventListener('mouseenter', (e)=>{
                e.preventDefault()
                this.elem.style.opacity = "1"
                this.elem.style.transitionDelay = "0.5s";
                this.elem.innerText = this.tooltipsTexts[e.target.id]
            })
            document.getElementById(elem).addEventListener('mouseleave', (e)=>{
                e.preventDefault()
                this.elem.style.opacity = "0"
                this.elem.style.transitionDelay = "0s";
            })
        })
    }
}