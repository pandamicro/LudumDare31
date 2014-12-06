var Enemy = cc.Sprite.extend({
    target: null,
    dieAnime: null,
    runAnime: null,
    chaseAnime: null,
    dirInDegree: 0,
    direction: 0,
    speed: CFG.Enemy.chaseSpeed,
    
    ctor: function(spriteFrame, target) {
        this._super(spriteFrame);
        this.target = target;
    },
    
    update: function(dt) {
        var x = this.x, 
            y = this.y;
        
        this.goAfter();
        x += Math.cos(this.direction);
        y += Math.sin(this.direction);
        if (x < CFG.groundW && x > 0) {
            this.x = x;
        }
        if (y < CFG.groundH && y > 0) {
            this.y = y;
        }
    },
    
    goAfter: function() {
        this.direction = cc.pToAngle(cc.pSub(this.target.getPosition(), cc.pAdd(this._position, this.parent._position)));
        this.direction < 0 && (this.direction += Math.PI * 2);
        this.dirInDegree = 180 * this.direction / Math.PI;
        this.chaseAnime && this.runAction(this.chaseAnime);
    },
    
    runAway: function() {
        this.dirInDegree = (this.dirInDegree + 30 + Math.round(Math.random() * 300)) % 360;
        this.direction = Math.PI * 2 * this.dirInDegree / 360;
        this.runAnime && this.runAction(this.runAnime);
        this.runAction(cc.sequence(
            cc.delayTime(5),
            cc.callFunc(this.goAfter, this)
        ));
    },
    
    hurt: function() {
        this.dieAnime && this.runAction(cc.sequence(
            this.dieAnime,
            cc.callFunc(this.killed, this)
        ));
    },
    
    killed: function() {
        this.removeFromParent(true);
    }
});