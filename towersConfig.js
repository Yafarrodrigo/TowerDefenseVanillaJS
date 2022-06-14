const _TOWERS = {

    laser:{
        type: "laser",
        imgSrc: "/TowerDefenseVanillaJS/Images/laserTurret.png",
        iconSrc: "/TowerDefenseVanillaJS/Images/laserTurretIcon.jpg",
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
        range: 100
    },

    slow:{
        type: "slow",
        imgSrc: "/TowerDefenseVanillaJS/Images/slowTurret.png",
        iconSrc: "/TowerDefenseVanillaJS/Images/slowTurretIcon.jpg",
        buyCost: 35,
        upgradeCost: 50,
        projectiles: false,
        description: "slows enemies",
        slow: 0.3,
        damage: 0.25,
        secondaryDamage: 0,
        upgradeSecondaryDamage: 0,
        upgradeDamage: 0.1,
        upgradeRange: 5,
        upgradeSlow: 0.05,
        range: 75
    },

    projectiles:{
        type: "projectiles",
        buyCost: 75,
        imgSrc: "/TowerDefenseVanillaJS/Images/projectilesTurret.png",
        iconSrc: "/TowerDefenseVanillaJS/Images/projectilesTurretIcon.jpg",
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
        range: 100
    },

    aoe:{
        type: "aoe",
        buyCost: 50,
        imgSrc: "/TowerDefenseVanillaJS/Images/aoeTurret.png",
        iconSrc: "/TowerDefenseVanillaJS/Images/aoeTurretIcon.jpg",
        upgradeCost: 50,
        projectiles: true,
        description: "damages in aoe",
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
