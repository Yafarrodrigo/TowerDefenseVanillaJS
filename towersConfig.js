const _TOWERS = {

    laser:{
        buyCost: 50,
        upgradeCost: 25,
        projectiles: false,
        description: "shoots lasers",
        slow: 0,
        damage: 1,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.5,
        upgradeRange: 10,
        upgradeSlow: 0,
        range: 100,
        color: "black"
    },

    slow:{
        buyCost: 35,
        upgradeCost: 50,
        projectiles: false,
        description: "slows enemies",
        slow: 0.5,
        damage: 0.25,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.1,
        upgradeRange: 0,
        upgradeSlow: 0.05,
        range: 115,
        color: "lightblue"
    },

    projectiles:{
        buyCost: 75,
        upgradeCost: 50,
        projectiles: true,
        description: "shoots projectiles",
        slow: 0,
        damage: 40,
        secondaryDamage: 0,
        upgradeDamage: 20,
        upgradeSecondaryDamage: 0,
        upgradeRange: 15,
        upgradeSlow: 0,
        range: 100,
        color: "lightgreen"
    },

    aoe:{
        buyCost: 50,
        upgradeCost: 50,
        projectiles: true,
        description: "damages in aoe",
        slow: 0,
        damage: 25,
        secondaryDamage: 15,
        upgradeDamage: 25,
        upgradeSecondaryDamage: 15,
        upgradeRange: 15,
        upgradeSlow: 0,
        range: 100,
        color: "purple"
    }

}

export default _TOWERS