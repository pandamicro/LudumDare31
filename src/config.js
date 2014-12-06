var marginX = 150,
    marginY = 120,
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
    
    inScaleX: 0.8,
    inScaleY: 0.65,
    
    outScaleX: 1.3,
    outScaleY: 2,
    
    tileBreakTime: 0.5,
    
    Wall: {
        tex: res.wall_png,
        rect: cc.rect(0, 0, 600, 338),
        capInset: cc.rect(0, 0, 600, 338),
    },
    
    Hero: {
        tex: res.hero_png,
        texRect: cc.rect(0, 0, 150, 100),
        scale: 0.7,
        speed: 5
    },
    
    Enemy: {
        chaseSpeed: 3,
        runSpeed: 3
    }
}