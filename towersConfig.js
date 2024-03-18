const _TOWERS = {

    laser:{
        type: 'laser',
        maxLevel: 10,
        buyCost: 25,
        upgradePrice: 25,
        projectiles: false,
        boosts: false,
        speed: 'very fast',
        description: 'shoots lasers',
        upgradeDescription: null,
        slow: 0,
        damage: 1.3,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.2,
        upgradeRange: 5,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 80
    },

    slow:{
        type: 'slow',
        maxLevel: 10,
        buyCost: 50,
        upgradePrice: 50,
        projectiles: false,
        boosts: false,
        speed: 'very fast',
        description: 'slows enemies',
        upgradeDescription: 'increases slow',
        slow: 0.1,
        damage: 0.25,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.1,
        upgradeRange: 2.5,
        upgradeSlow: 0.05,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 75
    },

    aoe:{
        type: 'aoe',
        maxLevel: 10,
        buyCost: 50,
        sellPrice : 25,
        upgradePrice: 75,
        projectiles: true,
        boosts: false,
        speed: 'average',
        description: 'damages in aoe',
        upgradeDescription: 'increases blast radius',
        slow: 0,
        damage: 25,
        secondaryDamage: 15,
        aoeRadius: 75,
        upgradeDamage: 7,
        upgradeSecondaryDamage: 5,
        upgradeRange: 5,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 100
    },

    sniper:{
        type: 'sniper',
        maxLevel: 10,
        buyCost: 75,
        upgradePrice: 75,
        projectiles: true,
        boosts: false,
        speed: 'slow',
        description: 'shoots projectiles',
        upgradeDescription: null,
        slow: 0,
        damage: 45,
        secondaryDamage: 0,
        upgradeDamage: 20,
        upgradeSecondaryDamage: 0,
        upgradeRange: 10,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 150
    },

    
    chainLaser:{
        type: 'chainLaser',
        maxLevel: 10,
        buyCost: 110,
        upgradePrice: 75,
        projectiles: false,
        boosts: false,
        speed: 'very fast',
        description: 'shoots chaining lasers',
        upgradeDescription: null,
        slow: 0,
        damage: 1.75,
        secondaryDamage: 0.5,
        upgradeDamage: 0.5,
        upgradeSecondaryDamage: 0.25,
        upgradeRange: 5,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 120
    },

    stop:{
        type: 'stop',
        maxLevel: 3,
        buyCost: 75,
        upgradePrice: 50,
        projectiles: false,
        boosts: false,
        speed: 'very slow',
        description: 'stops an enemy',
        upgradeDescription: 'increases range and duration',
        slow: 1,
        damage: 0,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0,
        upgradeRange: 10,
        upgradeSlow: 0.,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 75
    },

    boostDamage:{
        type: 'boostDamage',
        maxLevel: 10,
        buyCost: 100,
        upgradePrice: 50,
        projectiles: false,
        boosts: true,
        speed: 'none',
        description: 'boosts towers damage',
        upgradeDescription: 'increases own range',
        slow: 0,
        damage: 0,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0,
        upgradeRange: 5,
        upgradeSlow: 0,
        bonusDamage: 0.25,
        bonusSecondaryDamage: 0.25,
        bonusRange: 0,
        range: 90
    },

    boostRange:{
        type: 'boostRange',
        maxLevel: 10,
        buyCost: 100,
        upgradePrice: 50,
        projectiles: false,
        boosts: true,
        speed: 'none',
        description: 'boosts towers range',
        upgradeDescription: 'increases range boost',
        slow: 0,
        damage: 0,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0,
        upgradeRange: 0,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 5,
        range: 90
    }

}

export default _TOWERS
