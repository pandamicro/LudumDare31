var Enemy = cc.Sprite.extend({
    target: null,
    dieAnime: null,
    runAnime: null,
    chaseAnime: null,
    dirInDegree: 0,
    direction: 0,
    speed: CFG.Enemy.chaseSpeed,
    _currVec: cc.p(),
    _count: 0,
    damage: CFG.Enemy.damage,
    chasing: false,
    ranning: false,
    couraged: false,
    
    ctor: function(spriteFrame, target) {
        this._super(spriteFrame);
        this.target = target;
        this.speed += Math.random() * 1 - 0.5;
    },
    
    update: function(dt) {
        var x = this.x, 
            y = this.y;
        
        if (this._count >= 15) {
            this.strategy();
            this._count = 0;
        }
        this._count ++;
        
        x += this.speed * Math.cos(this.direction);
        y += this.speed * Math.sin(this.direction);
        if (x < CFG.width && x > -1) {
            this.x = x;
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
        
        if (!this.couraged && this.target.hasWeapon() && distance < warnDis)
            this.runAway();
        else if (distance < warnDis)
            this.goAfter();
        else {
            this.direction = Math.random() * Math.PI * 2;
            this.dirInDegree = 180 * this.direction / Math.PI;
            //this.speed = CFG.Enemy.restSpeed;
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
            this.runAnime && this.runAction(this.runAnime);
            this.scheduleOnce(this.getCouraged, CFG.Enemy.courageTime + Math.floor(Math.random() * CFG.Enemy.courageTime));
        }
    },
    
    getCouraged: function () {
        this.couraged = true;
        cc.log("Couraged");
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