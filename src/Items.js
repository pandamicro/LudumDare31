var Bullet = cc.Sprite.extend({
    setAnimation: function(arr) {
        var i, l, frame, frames = [], animation;
        for (i = 0, l = frames.length; i < l; ++i) {
            frame = cc.spriteFrameCache.getSpriteFrame(arr[i]);
            frames.push(frame);
        }
        animation = new cc.Animation(frames);
        this.runAction(cc.animate(animation).repeatForever());
    }
});

var Item = cc.Sprite.extend({
    isWeapon: true,
    
    ctor: function(spriteFrame) {
        this._super(new cc.SpriteFrame(res.item_png, cc.rect(0, 0, 40, 40)));
    },
    
    onEnter: function() {
        this._super();
        this.scheduleOnce(this.removeFromParent, easyRandom(CFG.itemDuration, CFG.itemDuration));
    },
    
    fire: function() {
    }
});