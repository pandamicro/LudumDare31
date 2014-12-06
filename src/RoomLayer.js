var RoomLayer = cc.Layer.extend({
    _wallLayer: null,
    _tiledLayer: null,
    _itemLayer: null,
    
    crystalLayer: null,
    hero: null,
    nextItemCount: CFG.itemInterval,
    
    ctor: function(hero) {
        this._super();
        this.hero = hero;
        
        this._tiledLayer = new TiledLayer(CFG.width-CFG.marginX*2, CFG.height-CFG.marginY*2, CFG.tileCol, CFG.tileRow);
        this._tiledLayer.x = CFG.marginX;
        this._tiledLayer.y = CFG.marginY;
        this.addChild(this._tiledLayer);
        
        this._wallLayer = new WallLayer(cc.winSize.width, cc.winSize.height);
        this.addChild(this._wallLayer);
        
        this._itemLayer = new ItemLayer(hero);
        this._itemLayer.x = CFG.marginX;
        this._itemLayer.y = CFG.marginY;
        this._itemLayer.width = CFG.groundW;
        this._itemLayer.height = CFG.groundH;
        this.addChild(this._itemLayer, 4);
    },
    
    onEnter: function() {
        this._super();
        for (var i = 0; i < 2; i++)
             this._itemLayer.addItem(Item);
    },
    
    update: function(dt) {
        var distance = 0, tarPos = this.hero.getPosition(), x, y,
            items = this._itemLayer.children, i, l, item;
        
        if (this.nextItemCount == 0) {
            this._itemLayer.addItem(Item);
            cc.log("generated");
            this.nextItemCount = easyRandom(CFG.itemInterval, CFG.itemInterval);
        }
        this.nextItemCount--;
        
        for (i = 0, l = items.length; i < l; ++i) {
            item = items[i];
            x = tarPos.x - (item._position.x + CFG.marginX);
            y = tarPos.y - (item._position.y + CFG.marginY);
            distance = Math.round(Math.sqrt(x * x + y * y));
            
            // Collision detected
            if (distance < item.width) {
                this.hero.getItem(item);
                break;
            }
        }
    },
    
    cleanUp: function() {
        this._tiledLayer.removeFromParent(true);
        this._itemLayer.removeFromParent(true);
    }
});