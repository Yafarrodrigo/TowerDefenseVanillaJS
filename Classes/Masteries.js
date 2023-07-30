export default class Masteries {
    constructor(game){
        this.game = game
        this.masteryPoints = 0
        this.availablePointsText = document.getElementById('unusedPoints')
        this.masteries = {

            rankOne:{
                laser:{
                    rank: 1,
                    name: "Laser Mastery",
                    desc: "All your laser turrets do more damage",
                    level: 0,
                    maxLevel: 5,
                },
                aoe:{
                    rank: 1,
                    name: "AoE Mastery",
                    desc: "All your AoE turrets have bigger AoE",
                    level: 0,
                    maxLevel: 5,
                },
                slow:{
                    rank: 1,
                    name: "Slow Mastery",
                    desc: "All your slow turrets have bigger range",
                    level: 0,
                    maxLevel: 5,
                }
            },
            rankTwo:{
                laserCredits:{
                    rank: 2,
                    name: "Laser Credits",
                    desc: "Enemies destroyed by laser turrets award 1 extra credit",
                    level: 0,
                    maxLevel: 3,
                },
                AoECredits:{
                    rank: 2,
                    name: "AoE Credits",
                    desc: "Enemies destroyed by AoE turrets award 2 extra credit",
                    level: 0,
                    maxLevel: 3,
                },
                sniperCredits:{
                    rank: 2,
                    name: "Sniper Credits",
                    desc: "Enemies destroyed by Sniper turrets award 3 extra credit",
                    level: 0,
                    maxLevel: 3,
                }
            },
            rankThree:{
                sniperLife:{
                    rank: 3,
                    name: "Sniper Life",
                    desc: "Enemies destroyed by Sniper turrets award 1 extra life",
                    level: 0,
                    maxLevel: 1,
                },
                creditsBeforeLife:{
                    rank: 3,
                    name: "Credits Before Life",
                    desc: "Lose 5 credits instead of 1 life for each enemy that escapes",
                    level: 0,
                    maxLevel: 1,
                },
                freezeThree:{
                    rank: 3,
                    name: "Freeze Three",
                    desc: "Freeze turrets freezes up to 3 enemies insead of 1",
                    level: 0,
                    maxLevel: 1,
                }
                
            }

        }
    }

    addPoints(q){
        this.masteryPoints += q
        this.availablePointsText.innerText = `mastery points available: ${this.masteryPoints}`
    }
}