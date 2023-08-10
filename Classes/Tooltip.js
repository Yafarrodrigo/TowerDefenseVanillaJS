export default class Tooltip{
    constructor(){
        this.elem = document.getElementById('tooltipDiv')
        this.elemsWithToolTip = ["levelInfo","masteriesOpenButton","lives","money",
                                "debug-play-pause","debug-speed-minus","debug-speed-plus",
                                "debug-speed-reset", "gameSpeed","help"]
        this.pos = [0,0]

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
                this.elem.style.transitionDelay = "1s";
            })
            document.getElementById(elem).addEventListener('mouseleave', (e)=>{
                e.preventDefault()
                this.elem.style.opacity = "0"
                this.elem.style.transitionDelay = "0s";
            })
        })
    }
}