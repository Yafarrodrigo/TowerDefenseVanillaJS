const _TOWERS = {

    laser:{
        type: "laser",
        buyCost: 25,
        sellPrice : 12,
        upgradePrice: 25,
        projectiles: false,
        speed: "very fast",
        description: "shoots lasers",
        upgradeDescription: null,
        slow: 0,
        damage: 1,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.5,
        upgradeRange: 10,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 100
    },

    slow:{
        type: "slow",
        buyCost: 50,
        sellPrice : 25,
        upgradePrice: 50,
        projectiles: false,
        speed: "very fast",
        description: "slows enemies",
        upgradeDescription: "increases slow",
        slow: 0.3,
        damage: 0.25,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.10,
        upgradeRange: 5,
        upgradeSlow: 0.05,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 75
    },

    aoe:{
        type: "aoe",
        buyCost: 50,
        sellPrice : 25,
        upgradePrice: 50,
        projectiles: true,
        speed: "average",
        description: "damages in aoe",
        upgradeDescription: null,
        slow: 0,
        damage: 20,
        secondaryDamage: 12,
        upgradeDamage: 20,
        upgradeSecondaryDamage: 12,
        upgradeRange: 10,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 100
    },

    projectiles:{
        type: "projectiles",
        buyCost: 75,
        sellPrice : 36,
        upgradePrice: 50,
        projectiles: true,
        speed: "average",
        description: "shoots projectiles",
        upgradeDescription: null,
        slow: 0,
        damage: 40,
        secondaryDamage: 0,
        upgradeDamage: 20,
        upgradeSecondaryDamage: 0,
        upgradeRange: 10,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 0,
        range: 120
    },

    boostDamage:{
        type: "boostDamage",
        buyCost: 100,
        sellPrice : 50,
        upgradePrice: 50,
        projectiles: false,
        speed: "none",
        description: "boosts towers damage",
        upgradeDescription: "boosts range and others damage",
        slow: 0,
        damage: 0,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0,
        upgradeRange: 10,
        upgradeSlow: 0,
        bonusDamage: 0.25,
        bonusSecondaryDamage: 0.25,
        bonusRange: 0,
        range: 100
    },

    boostRange:{
        type: "boostRange",
        buyCost: 100,
        sellPrice : 50,
        upgradePrice: 50,
        projectiles: false,
        speed: "none",
        description: "boosts towers range",
        upgradeDescription: "boosts own and others range",
        slow: 0,
        damage: 0,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0,
        upgradeRange: 5,
        upgradeSlow: 0,
        bonusDamage: 0,
        bonusSecondaryDamage: 0,
        bonusRange: 5,
        range: 75
    }

}

export default _TOWERS
