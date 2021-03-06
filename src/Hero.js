var Hero = cc.Sprite.extend({
    upAnime: null,
    downAnime: null,
    leftAnime: null,
    rightAnime: null,
    fallAnime: null,
    dieAnime: null,
    standUp: null,
    standDown: null,
    standLeft: null,
    standRight: null,
    preFallFr: null,
    fallingFr: null,
    landedFr: null,
    collisionObjs: null,
    
    speed: CFG.Hero.speed,
    hp: CFG.Hero.hp,
    
    unhurtable: false,
    isFalling: false,
    
    faceLeft: false,
    faceRight: false,
    faceUp: false,
    faceDown: false,
    walking: false,
    
    hasBean: false,
    
    w: 0,
    h: 0,
    
    item: null,
    
    ctor: function() {
        var c, r, 
            names = ["downAnime", "leftAnime", "rightAnime", "upAnime"], 
            name, frame, frames, frameName, 
            animation, 
            x, y;
        
        this._super("#hero1.png");
        
        frameName = "hero";
        for (r = 0; r < 4; ++r) {
            name = names[r];
            frames = [];
            for (c = 1; c < 3; ++c) {
                frame = cc.spriteFrameCache.getSpriteFrame(frameName + (r*3+c+1) + ".png");
                frames.push(frame);
            }
            animation = new cc.Animation(frames, 0.2);
            this[name] = cc.animate(animation).repeatForever();
        }
        
        this.standDown = cc.spriteFrameCache.getSpriteFrame("hero1.png");
        this.standLeft = cc.spriteFrameCache.getSpriteFrame("hero4.png");
        this.standRight = cc.spriteFrameCache.getSpriteFrame("hero7.png");
        this.standUp = cc.spriteFrameCache.getSpriteFrame("hero10.png");
        this.preFallFr = cc.spriteFrameCache.getSpriteFrame("hero13.png");
        this.fallingFr = cc.spriteFrameCache.getSpriteFrame("hero14.png");
        this.landedFr = cc.spriteFrameCache.getSpriteFrame("hero15.png");
        
        frames = [];
        frames.push(cc.spriteFrameCache.getSpriteFrame("hero16.png"));
        frames.push(cc.spriteFrameCache.getSpriteFrame("hero17.png"));
        frames.push(cc.spriteFrameCache.getSpriteFrame("hero18.png"));
        animation = new cc.Animation(frames, 0.2);
        this.dieAnime = cc.animate(animation).repeatForever();
        
        this.stand();
        this.collisionObjs = [];
        this.scale = CFG.Hero.scale;
        this.w = this.width * CFG.Hero.scale * 0.5;
        this.h = this.height * CFG.Hero.scale * 0.8;
    },
    
    onEnter: function() {
        this._super();
        
        cc.eventManager.addListener(HeroKeyboardManager, this);
    },
    
    addCollisionObj: function(obj) {
        this.collisionObjs.push(obj);
    },
    removeCollisionObj: function(obj) {
        var id = this.collisionObjs.indexOf(obj);
        if (id != -1)
            this.collisionObjs.splice(id, 1);
    },
    
    stand: function() {
        this.stopAllActions();
        this.walking = false;
        if (this.faceUp) {
            this.setSpriteFrame(this.standUp);
        }
        else if (this.faceDown) {
            this.setSpriteFrame(this.standDown);
        }
        else if (this.faceLeft) {
            this.setSpriteFrame(this.standLeft);
        }
        else if (this.faceRight) {
            this.setSpriteFrame(this.standRight);
        }
    },
    
    fall: function() {
        this.walking = false;
        this.isFalling = true;
        this.stopAllActions();
        this.setSpriteFrame(this.preFallFr);
    },
    
    falling: function() {
        this.isFalling = true;
        this.stopAllActions();
        this.setSpriteFrame(this.fallingFr);
    },
    
    landed: function() {
        this.isFalling = true;
        this.stopAllActions();
        this.setSpriteFrame(this.landedFr);
        this.scheduleOnce(this.fallOver, 0.3);
    },
    
    fallOver: function() {
        this.isFalling = false;
        this.faceDown = true;
        this.stand();
    },
    
    hasWeapon: function() {
        return this.item && this.item.isWeapon ? true : false;
    },
    
    shoot: function() {
        if (!this.dead && this.item) {
            var speedX = this.faceRight ? 1 : (this.faceLeft ? -1 : 0), 
                speedY = this.faceUp ? 1 : (this.faceDown ? -1 : 0);
            this.item.fire(this.x, this.y, speedX, speedY);
            this.item.release();
            this.item = null;
            GameScene.instance.uiLayer.setItem(null);
        }
    },
    
    die: function() {
        if (!this.dead) {
            this.dead = true;
            this.stopAllActions();
            this.runAction(this.dieAnime);
            GameScene.instance.gameOver();
        }
    },
    
    hurt: function(damage) {
        if (this.unhurtable || this.dead) return;
        
        this.hp -= damage;
        GameScene.instance.uiLayer.setHp(this.hp);
        if (this.hp <= 0) {
            this.die();
        }
        else {
            this.unhurtable = true;
            this.scheduleOnce(this.turnNormal, 1);
        }
    },
    
    turnNormal: function () {
        this.unhurtable = false;
    },
    
    getItem: function(item) {
        if (!item.canGet || item.canGet()) {
            if (item.isWeapon) {
                GameScene.instance.uiLayer.setItem(item.getTexture(), item.getTextureRect(), item.isTextureRectRotated());
                item.retain();
                this.item = item;
            }
            else {
                item.fire();
                if (item instanceof Princess)
                    return;
            }
            item.removeFromParent(true);
        }
    },
    
    update: function() {
        if(this.dead) return;
        
        var x = this.x, y = this.y, i, l, obj, r1, r2;
        if (this.walking) {
            if (this.faceRight && x <= CFG.rightBorder) {
                x += this.speed;
            }
            else if (this.faceLeft && x >= CFG.leftBorder) {
                x -= this.speed;
            }
            else if (this.faceUp && y <= CFG.upBorder) {
                y += this.speed;
            }
            else if (this.faceDown && y >= CFG.downBorder) {
                y -= this.speed;
            }
        }
        
        r1 = cc.rect(x - this.w/2, y - this.h/2, this.w, this.h);
        for (i = 0, l = this.collisionObjs.length; i < l; i++) {
            obj = this.collisionObjs[i];
            r2 = obj.getCollisionRect();
            if (cc.rectIntersectsRect(r1, r2)) {
                obj.collision = true;
                return;
            }
        }
        this.x = x;
        this.y = y;
    }
});

var _p = Hero.prototype;
/** @expose */
_p.upAnime;
/** @expose */
_p.downAnime;
/** @expose */
_p.leftAnime;
/** @expose */
_p.rightAnime;
/** @expose */
_p.fallAnime;