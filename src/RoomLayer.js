var RoomLayer = cc.Layer.extend({
    _wallLayer: null,
    _tiledLayer: null,
    _itemLayer: null,
    
    ctor: function() {
        this._super();
        
        this._tiledLayer = new TiledLayer(CFG.width-CFG.marginX*2, CFG.height-CFG.marginY*2, CFG.tileCol, CFG.tileRow);
        this._tiledLayer.x = CFG.marginX;
        this._tiledLayer.y = CFG.marginY;
        this.addChild(this._tiledLayer);
        
        this._wallLayer = new WallLayer(cc.winSize.width, cc.winSize.height);
        this.addChild(this._wallLayer);
    },
    
    onEnter: function() {
        this._super();
    }
});