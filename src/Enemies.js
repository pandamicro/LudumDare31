var Enemy = cc.Sprite.extend({
    target: null,
    dieAnime: null,
    runAnime: null,
    chaseAnime: null,
    chaseFr: null,
    runFr: null,
    restFr: null,
    dirInDegree: 0,
    direction: 0,
    speed: CFG.Enemy.chaseSpeed,
    _currVec: cc.p(),
    _count: 0,
    damage: CFG.Enemy.damage,
    chasing: false,
    ranning: false,
    couraged: false,
    courageScheduled: false,
    
    disabled: false,
    
    ctor: function(target) {
        var tex = CFG.Enemy.tex;
        this.chaseFr = cc.spriteFrameCache.getSpriteFrame(CFG.Enemy.chaseFr);
        this.runFr = cc.spriteFrameCache.getSpriteFrame(CFG.Enemy.runFr);
        this.restFr = cc.spriteFrameCache.getSpriteFrame(CFG.Enemy.restFr);
        
        this._super(this.restFr);
        this.target = target;
        this.speed += Math.random() * 1 - 0.5;
        
        this.dieAnime = cc.fadeOut(0.5);
    },
    
    update: function(dt) {
        if (this.disabled) return;
        
        var x = this.x, 
            y = this.y,
            dx, dy;
        
        if (this._count >= 15) {
            this.strategy();
            this._count = 0;
        }
        this._count ++;
        
        dx = this.speed * Math.cos(this.direction);
        dy = this.speed * Math.sin(this.direction);
        x += dx;
        y += dy;
        if (x < CFG.width && x > -1) {
            this.x = x;
            if (dx > 0 && !this._flippedX)
                this.flippedX = true;
            else if (dx < 0 && this._flippedX)
                this.flippedX = false;
        }
        if (y < CFG.height && y > -1) {
            this.y = y;
        }
    },
    
    strategy: function() {
        var distance = 0, tarPos = this.target.getPosition(), x, y, warnDis = CFG.Enemy.warnDis;
        
        x = this._currVec.x = tarPos.x - (this._position.x + this.parent._position.x);
        y = this._currVec.y = tarPos.y - (this._position.y + this.parent._position.y);
        distance = Math.round(Math.sqrt(x * x + y * y));
        
        if (distance < this.width/2) {
            this.target.hurt(this.damage);
        }
        
        if (!this.target.dead && !this.couraged && this.target.hasWeapon() && distance < warnDis)
            this.runAway();
        else if (!this.target.dead && distance < warnDis)
            this.goAfter();
        else {
            this.direction = Math.random() * Math.PI * 2;
            this.dirInDegree = 180 * this.direction / Math.PI;
            //this.speed = CFG.Enemy.restSpeed;
            if (this.chasing || this.ranning) {
                this.chasing = false;
                this.ranning = false;
                this.setSpriteFrame(this.restFr);
            }
        }
    },
    
    goAfter: function() {
        this.direction = cc.pToAngle(this._currVec);
        this.direction < 0 && (this.direction += Math.PI * 2);
        this.dirInDegree = 180 * this.direction / Math.PI;
        if (!this.chasing) {
            this.chasing = true;
            this.ranning = false;
            this.stopAllActions();
            this.setSpriteFrame(this.chaseFr);
            this.chaseAnime && this.runAction(this.chaseAnime);
        }
    },
    
    runAway: function() {
        this.direction = cc.pToAngle(cc.p(-this._currVec.x, -this._currVec.y));
        this.direction < 0 && (this.direction += Math.PI * 2);
        this.dirInDegree = 180 * this.direction / Math.PI;
        //this.dirInDegree = (this.dirInDegree + 30 + Math.round(Math.random() * 300)) % 360;
        //this.direction = Math.PI * 2 * this.dirInDegree / 360;
        if (!this.ranning) {
            this.chasing = false;
            this.ranning = true;
            this.stopAllActions();
            this.setSpriteFrame(this.runFr);
            this.runAnime && this.runAction(this.runAnime);
            if (!this.courageScheduled) {
                this.scheduleOnce(this.getCouraged, CFG.Enemy.courageTime + Math.floor(Math.random() * CFG.Enemy.courageTime));
                this.courageScheduled = true;
            }
        }
    },
    
    getCouraged: function () {
        this.couraged = true;
    },
    
    hurt: function() {
        this.setSpriteFrame(this.runFr);
        this.runAction(cc.sequence(
            this.dieAnime,
            cc.callFunc(this.removeFromParent, this)
        ));
        return true;
    }
});