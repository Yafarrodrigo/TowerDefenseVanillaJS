import _PATHS from './imgPaths.js'

const _MASTERIES = {

    rankOne:{
        laserMastery:{
            id: 'laserMastery',
            rank: 'rankOne',
            name: 'Laser Mastery',
            desc: 'Your lasers turrets do more damage (+50%)',
            level: 0,
            maxLevel: 1,
            img: _PATHS.laserMastery
        },
        aoeMastery:{
            id: 'aoeMastery',
            rank: 'rankOne',
            name: 'AoE Mastery',
            desc: 'Your AoE turrets have bigger AoE (+50%)',
            level: 0,
            maxLevel: 1,
            img: _PATHS.aoeMastery
        },
        slowMastery:{
            id: 'slowMastery',
            rank: 'rankOne',
            name: 'Slow Mastery',
            desc: 'Your slow turrets have bigger range (+50%)',
            level: 0,
            maxLevel: 1,
            img: _PATHS.slowMastery
        }
    },
    rankTwo:{
        laserCreditsMastery:{
            id: 'laserCreditsMastery',
            rank: 'rankTwo',
            name: 'Laser Credits Mastery',
            desc: 'Enemies destroyed by your lasers turrets award 1 extra credit',
            level: 0,
            maxLevel: 1,
            img: _PATHS.laserCreditsMastery
        },
        AoECreditsMastery:{
            id: 'AoECreditsMastery',
            rank: 'rankTwo',
            name: 'AoE Credits Mastery',
            desc: 'Enemies destroyed by AoE turrets award 2 extra credit',
            level: 0,
            maxLevel: 1,
            img: _PATHS.AoECreditsMastery
        },
        sniperCreditsMastery:{
            id: 'sniperCreditsMastery',
            rank: 'rankTwo',
            name: 'Sniper Credits Mastery',
            desc: 'Enemies destroyed by Sniper turrets award 3 extra credit',
            level: 0,
            maxLevel: 1,
            img: _PATHS.sniperCreditsMastery
        }
    },
    rankThree:{
        sniperLifeMastery:{
            id: 'sniperLifeMastery',
            rank: 'rankThree',
            name: 'Sniper Life Mastery',
            desc: 'Enemies destroyed by Sniper turrets award 1 extra life',
            level: 0,
            maxLevel: 1,
            img: _PATHS.sniperLifeMastery
        },
        creditsBeforeLifeMastery:{
            id: 'creditsBeforeLifeMastery',
            rank: 'rankThree',
            name: 'Credits Before Life Mastery',
            desc: 'Lose 5 credits instead of 1 life for each enemy that escapes',
            level: 0,
            maxLevel: 1,
            img: _PATHS.creditsBeforeLifeMastery
        },
        sacrificeMastery:{
            id: 'sacrificeMastery',
            rank: 'rankThree',
            name: 'Sacrifice Mastery',
            desc: 'Gain 1000 credits for each life you lose',
            level: 0,
            maxLevel: 1,
            img: _PATHS.sacrificeMastery
        }
        
    }

}

export default _MASTERIES