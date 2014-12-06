var Item = cc.Sprite.extend({
    ctor: function(spriteFrame) {
        this._super(new cc.SpriteFrame(res.item_png, cc.rect(0, 0, 40, 40)));
    },
    
    onEnter: function() {
        this._super();
        this.scheduleOnce(this.removeFromParent, easyRandom(CFG.itemDuration, CFG.itemDuration));
    }
});