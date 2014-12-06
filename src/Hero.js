var Hero = cc.Sprite.extend({
    upAnime: null,
    downAnime: null,
    leftAnime: null,
    rightAnime: null,
    standUp: null,
    standDown: null,
    standLeft: null,
    standRight: null,
    
    speed: CFG.Hero.speed,
    
    goLeft: false,
    goRight: false,
    goUp: false,
    goDown: false,
    
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
        
        this.scale = CFG.Hero.scale;
    },
    
    onEnter: function() {
        this._super();
        
        cc.eventManager.addListener(HeroKeyboardManager, this);
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
    
    update: function() {
        var x = this.x, y = this.y;
        if (this.goRight && x <= CFG.rightBorder) {
            this.x = x + this.speed;
        }
        else if (this.goLeft && x >= CFG.leftBorder) {
            this.x = x - this.speed;
        }
        else if (this.goUp && y <= CFG.upBorder) {
            this.y = y + this.speed;
        }
        else if (this.goDown && y >= CFG.downBorder) {
            this.y -= this.speed;
        }
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