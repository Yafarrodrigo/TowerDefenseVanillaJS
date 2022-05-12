const _TOWERS = {

    laser:{
        buyCost: 25,
        upgradeCost: 25,
        projectiles: false,
        description: "shoots lasers",
        slow: 0,
        damage: 1,
        secondaryDamage: 0,
        upgradeDamage: 0.5,
        upgradeRange: 10,
        upgradeSlow: 0,
        range: 100,
        color: "black"
    },

    slow:{
        buyCost: 50,
        upgradeCost: 75,
        projectiles: false,
        description: "slows enemies",
        slow: 0.5,
        damage: 0.25,
        secondaryDamage: 0,
        upgradeDamage: 0.1,
        upgradeRange: 0,
        upgradeSlow: 0.25,
        range: 100,
        color: "lightblue"
    },

    projectiles:{
        buyCost: 50,
        upgradeCost: 50,
        projectiles: true,
        description: "shoots projectiles",
        slow: 0,
        damage: 25,
        secondaryDamage: 0,
        upgradeDamage: 10,
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
        upgradeDamage: 10,
        upgradeRange: 15,
        upgradeSlow: 0,
        range: 100,
        color: "purple"
    }

}

export default _TOWERS