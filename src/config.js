var marginX = 130,
    marginY = 130,
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
    
    leftBorder: marginX,
    rightBorder: width - marginX,
    downBorder: marginY,
    upBorder: height - marginY,
    
    inScaleX: 0.78,
    inScaleY: 0.68,
    
    outScaleX: 1.3,
    outScaleY: 1.5,
    
    tileBreakTime: 0.5,
    
    Wall: {
        tex: res.wall_png,
        rect: cc.rect(0, 0, 598, 395),
        capInset: cc.rect(0, 0, 598, 395),
    },
    
    Hero: {
        tex: res.hero_png,
        texRect: cc.rect(0, 0, 150, 100),
        scale: 0.7,
        speed: 5,
        hp: 100
    },
    
    Enemy: {
        tex: res.enemy_png,
        chaseSpeed: 1.5,
        restSpeed: 0.5,
        runSpeed: 2,
        warnDis: 300,
        damage: 10,
        courageTime: 7,
        chaseRect: cc.rect(200, 0, 100, 120),
        runRect: cc.rect(100, 0, 100, 120),
        restRect: cc.rect(0, 0, 100, 120)
    },
    
    itemInterval: 350,
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
    itemsZ: 4
}

function easyRandom(seed, range) {
    return Math.round(seed + Math.random() * range - range/2);
}