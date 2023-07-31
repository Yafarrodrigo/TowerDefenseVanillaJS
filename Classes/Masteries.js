import _MASTERIES from '../masteriesConfig.js'

export default class Masteries {
    constructor(game){
        this.game = game
        this.masteryPoints = 0
        this.availablePointsText = document.getElementById('unusedPoints')
        this.allMasteries = _MASTERIES
        this.purshasedRanks = {
            rankOne: false,
            rankTwo: false,
            rankThree: false
        }
        this.currentRank = "rankOne"
        
        this.activeMasteries = {}
        for(const rank in this.allMasteries){
            for(const mastery in this.allMasteries[rank]){
                this.activeMasteries[mastery] = {...this.allMasteries[rank][mastery]}
            }
        }
        this.createUI()
    }

    createUI(){
        const {masteriesContainer} = this.game.infoPanel


        for(let rank in _MASTERIES){
            const r = _MASTERIES[rank]

            const rankContainer = document.createElement('div')
            rankContainer.classList.add('masteryRank')
            rankContainer.id = rank+"Masteries"

            for(let mastery in _MASTERIES[rank]){
                const m = _MASTERIES[rank][mastery]

                const masteryContainer = document.createElement('div')
                masteryContainer.classList.add('mastery')
                if(m.rank === "rankTwo" || m.rank === "rankThree"){
                    masteryContainer.classList.add('mastery-disabled')
                }
                masteryContainer.id = mastery+"-"+rank

                masteryContainer.addEventListener('click', (e) => {
                    e.preventDefault()
                    if(!e.target.classList.contains('mastery-disabled')){
                        const id = e.target.id.split('-')[0]
                        const rank = e.target.id.split('-')[1]
                        const selectedMastery = this.allMasteries[rank][id]
                        this.buyMastery(selectedMastery.id, selectedMastery.rank)
                    }
                })

                const img = document.createElement('img')
                img.src = m.img
                img.classList.add('masteryImg')

                const name = document.createElement('div')
                name.innerText = `${m.name} ( ${m.level} / ${m.maxLevel} )`
                name.classList.add('masteryName')

                const desc = document.createElement('div')
                desc.innerText = m.desc
                desc.classList.add('masteryDesc')

                masteryContainer.append(img,name,desc)
                rankContainer.append(masteryContainer)
            }

            masteriesContainer.append(rankContainer)
        }

    }

    buyMastery(id,rank){
        if(this.masteryPoints <= 0 || this.purshasedRanks[rank] === true) return
        
        if(this.activeMasteries[id]){
            if(this.activeMasteries[id].level + 1 <= this.activeMasteries[id].maxLevel){
                this.activeMasteries[id].level += 1
            }else{
                return
            }
        }else{
            this.activeMasteries[id] = this.allMasteries[rank][id]
            this.activeMasteries[id].level += 1
        }

        this.purshasedRanks[rank] = true
        if(rank === "rankOne") this.currentRank = "rankTwo"
        else if(rank === "rankTwo") this.currentRank = "rankThree"
        else if(rank === "rankThree") this.currentRank = "rankFour"
        this.masteryPoints -= 1
        this.updateUI()

    }

    check(id){
        if(this.activeMasteries[id] && this.activeMasteries[id].level > 0) return true
        else return false
    }

    updateUI(){
        
        this.availablePointsText.innerText = `mastery points available: ${this.masteryPoints}`

        for(let mastery in this.activeMasteries){
            const m = this.activeMasteries[mastery]
            const elem = document.getElementById(`${m.id}-${m.rank}`)
            elem.children[1].innerText = `${m.name} ( ${m.level} / ${m.maxLevel} )`
            if(m.level > 0 && this.purshasedRanks[m.rank] === true){
                elem.classList.remove('mastery-disabled')
            }else{
                elem.classList.add('mastery-disabled')
            }
            if(m.rank === this.currentRank){
                elem.classList.remove('mastery-disabled')
            }

        }
    }

    addPoints(q){
        if(this.currentRank === "rankFour") return
        this.masteryPoints += q
        this.availablePointsText.innerText = `mastery points available: ${this.masteryPoints}`
    }
}