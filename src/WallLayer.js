var WallLayer = cc.Layer.extend({
    _wall: null,
    
    ctor: function(width, height) {
        var batchNode_scaled;
        
        this._super();
        batchNode_scaled = new cc.SpriteBatchNode(CFG.Wall.tex);

        this._wall = new cc.Scale9Sprite();
        this._wall.updateWithBatchNode(batchNode_scaled, CFG.Wall.rect, false, CFG.Wall.capInset);
        
        this._wall.width = width;
        this._wall.height = height;
        this._wall.x = width/2;
        this._wall.y = height/2;

        this.addChild(this._wall);
    }
});