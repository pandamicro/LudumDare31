var Hero = cc.Sprite.extend({
    upAnime: null,
    downAnime: null,
    leftAnime: null,
    rightAnime: null,
    standUp: null,
    standDown: null,
    standLeft: null,
    standRight: null,
    collisionObjs: null,
    
    speed: CFG.Hero.speed,
    hp: CFG.Hero.hp,
    
    unhurtable: false,
    
    goLeft: false,
    goRight: false,
    goUp: false,
    goDown: false,
    
    w: 0,
    h: 0,
    
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
        
        this.stand();
        this.collisionObjs = [];
        this.scale = CFG.Hero.scale;
        this.w = this.width;
        this.h = this.height;
    },
    
    onEnter: function() {
        this._super();
        
        cc.eventManager.addListener(HeroKeyboardManager, this);
    },
    
    addCollisionObj: function(obj) {
        this.collisionObjs.push(obj);
    },
    
    stand: function() {
        this.stopAllActions();
        if (this.goUp) {
            this.goUp = false;
            this.setSpriteFrame(this.standUp);
        }
        else if (this.goDown) {
            this.goDown = false;
            this.setSpriteFrame(this.standDown);
        }
        else if (this.goLeft) {
            this.goLeft = false;
            this.setSpriteFrame(this.standLeft);
        }
        else if (this.goRight) {
            this.goRight = false;
            this.setSpriteFrame(this.standRight);
        }
    },
    
    shoot: function() {
    },
    
    hurt: function(damage) {
        if (this.unhurtable) return;
        
        this.hp -= damage;
        cc.log("HP: " + this.hp);
        if (this.hp < 0) {
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
        item.removeFromParent(true);
    },
    
    update: function() {
        var x = this.x, y = this.y, i, l, obj, r1, r2;
        if (this.goRight && x <= CFG.rightBorder) {
            x += this.speed;
        }
        else if (this.goLeft && x >= CFG.leftBorder) {
            x -= this.speed;
        }
        else if (this.goUp && y <= CFG.upBorder) {
            y += this.speed;
        }
        else if (this.goDown && y >= CFG.downBorder) {
            y -= this.speed;
        }
        
        r1 = cc.rect(x - this.w/2, y - this.h/2, this.w, this.h);
        for (i = 0, l = this.collisionObjs.length; i < l; i++) {
            obj = this.collisionObjs[i];
            r2 = obj.getCollisionRect();
            if (cc.rectContainsRect(r1, r2)) {
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