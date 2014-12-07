var Hero = cc.Sprite.extend({
    upAnime: null,
    downAnime: null,
    leftAnime: null,
    rightAnime: null,
    fallAnime: null,
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
    
    w: 0,
    h: 0,
    
    item: null,
    
    ctor: function() {
        var c, r, 
            names = ["downAnime", "leftAnime", "rightAnime", "upAnime"], 
            name, frame, frames, 
            animation,
            tex = CFG.Hero.tex, 
            x, y, 
            w = CFG.Hero.texRect.width,
            h = CFG.Hero.texRect.height,
            rect = cc.rect(0, 0, w, h);
        
        this._super(tex, CFG.Hero.texRect);
        
        for (r = 0; r < 4; ++r) {
            name = names[r];
            frames = [];
            for (c = 1; c < 3; ++c) {
                rect.x = c * w;
                rect.y = r * h;
                frame = new cc.SpriteFrame(tex, rect);
                
                frames.push(frame);
            }
            animation = new cc.Animation(frames, 0.2);
            this[name] = cc.animate(animation).repeatForever();
        }
        
        rect.x = 0;
        rect.y = 0;
        this.standDown = new cc.SpriteFrame(tex, rect);
        rect.y += h;
        this.standLeft = new cc.SpriteFrame(tex, rect);
        rect.y += h;
        this.standRight = new cc.SpriteFrame(tex, rect);
        rect.y += h;
        this.standUp = new cc.SpriteFrame(tex, rect);
        rect.y += h;
        this.preFallFr = new cc.SpriteFrame(tex, rect);
        rect.x += w;
        this.fallingFr = new cc.SpriteFrame(tex, rect);
        rect.x += w;
        this.landedFr = new cc.SpriteFrame(tex, rect);
        
        this.stand();
        this.collisionObjs = [];
        this.scale = CFG.Hero.scale;
        this.w = this.width * CFG.Hero.scale * 0.5;
        this.h = this.height * CFG.Hero.scale;
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
        if (this.item) {
            var speedX = this.faceRight ? 1 : (this.faceLeft ? -1 : 0), 
                speedY = this.faceUp ? 1 : (this.faceDown ? -1 : 0);
            cc.log("Shoot");
            this.item.fire(this.x, this.y, speedX, speedY);
            this.item.release();
            this.item = null;
        }
    },
    
    hurt: function(damage) {
        if (this.unhurtable) return;
        
        if (this.hp <= 0) {
        }
        else {
            this.hp -= damage;
            cc.log("HP: " + this.hp);
            this.unhurtable = true;
            this.scheduleOnce(this.turnNormal, 1);
        }
    },
    
    turnNormal: function () {
        this.unhurtable = false;
    },
    
    getItem: function(item) {
        item.removeFromParent(true);
        if (item.isWeapon) {
            item.retain();
            this.item = item;
        }
        else {
            item.fire();
        }
    },
    
    update: function() {
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