var marginX = 125,
    marginY = 125,
    width = 1200,
    height = 800;

var CFG = {
    width: width,
    height: height,
    marginX: marginX,
    marginY: marginY,
    tileRow: 8,
    tileCol: 14,
    groundW: width - marginX * 2,
    groundH: height - marginY * 2,
    
    leftBorder: marginX + 15,
    rightBorder: width - marginX - 15,
    downBorder: marginY + 20,
    upBorder: height - marginY,
    
    inScaleX: 0.78,
    inScaleY: 0.68,
    
    outScaleX: 1.3,
    outScaleY: 1.5,
    
    tileBreakTime: 0.5,
    
    Wall: {
        tex: res.wall_png,
        rect: cc.rect(0, 0, 598, 396),
        capInset: cc.rect(0, 0, 598, 396),
    },
    
    Hero: {
        scale: 0.8,
        speed: 5,
        hp: 100
    },
    
    Enemy: {
        chaseSpeed: 1.5,
        restSpeed: 0.5,
        runSpeed: 2,
        warnDis: 300,
        damage: 10,
        courageTime: 7,
        chaseFr: "fantome_chase.png",
        runFr: "fantome_run.png",
        restFr: "fantome_rest.png"
    },
    
    itemInterval: 300,
    itemDuration: 5,
    
    bulletSpeed: 8,
    bulletZ: 8,
    
    flowerDamage: 1,
    bulletDamage: 1,
    pacmanDamage: 1,
    bladeDamage: 1,
    
    frameTag: 123,
    
    home1X: 280,
    home1Y: 200,
    home2X: 950,
    home2Y: 350,
    
    objZ: 7,
    itemsZ: 4,
    roomZ: 1,
    heroZ: 3,
    fantomeZ: 1,
    
    winType: winType,
    
    contraArmorBaseHP: 1,
    contraWallHP: 25,
    contraArmorInterval: 250
}

function easyRandom(seed, range) {
    return Math.round(seed + Math.random() * range - range/2);
}