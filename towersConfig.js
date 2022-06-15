const _TOWERS = {

    laser:{
        type: "laser",
        imgSrc: "../Images/laserTurret.png",
        iconSrc: "../Images/laserTurretIcon.jpg",
        buyCost: 50,
        sellPrice : 25,
        upgradePrice: 25,
        projectiles: false,
        description: "shoots lasers",
        upgradeDescription: null,
        slow: 0,
        damage: 1,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.5,
        upgradeRange: 10,
        upgradeSlow: 0,
        range: 100
    },

    slow:{
        type: "slow",
        imgSrc: "../Images/slowTurret.png",
        iconSrc: "../Images/slowTurretIcon.jpg",
        buyCost: 35,
        sellPrice : 17,
        upgradePrice: 50,
        projectiles: false,
        description: "slows enemies",
        upgradeDescription: "increases slow",
        slow: 0.3,
        damage: 0.25,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.10,
        upgradeRange: 5,
        upgradeSlow: 0.05,
        range: 75
    },

    projectiles:{
        type: "projectiles",
        buyCost: 75,
        sellPrice : 37,
        imgSrc: "../Images/projectilesTurret.png",
        iconSrc: "../Images/projectilesTurretIcon.jpg",
        upgradePrice: 50,
        projectiles: true,
        description: "shoots projectiles",
        upgradeDescription: null,
        slow: 0,
        damage: 40,
        secondaryDamage: 0,
        upgradeDamage: 20,
        upgradeSecondaryDamage: 0,
        upgradeRange: 10,
        upgradeSlow: 0,
        range: 120
    },

    aoe:{
        type: "aoe",
        buyCost: 50,
        sellPrice : 25,
        imgSrc: "../Images/aoeTurret.png",
        iconSrc: "../Images/aoeTurretIcon.jpg",
        upgradePrice: 50,
        projectiles: true,
        description: "damages in aoe",
        upgradeDescription: null,
        slow: 0,
        damage: 20,
        secondaryDamage: 12,
        upgradeDamage: 20,
        upgradeSecondaryDamage: 12,
        upgradeRange: 10,
        upgradeSlow: 0,
        range: 100
    }

}

export default _TOWERS
