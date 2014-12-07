var RoomLayer = cc.Layer.extend({
    _wallLayer: null,
    _tiledLayer: null,
    _itemLayer: null,
    
    crystalLayer: null,
    hero: null,
    nextItemCount: CFG.itemInterval,
    
    ctor: function(hero, itemTypes, probs) {
        this._super();
        this.hero = hero;
        
        this._tiledLayer = new TiledLayer(CFG.width-CFG.marginX*2, CFG.height-CFG.marginY*2, CFG.tileCol, CFG.tileRow);
        this._tiledLayer.x = CFG.marginX;
        this._tiledLayer.y = CFG.marginY;
        this.addChild(this._tiledLayer);
        
        this._wallLayer = new WallLayer(cc.winSize.width, cc.winSize.height);
        this.addChild(this._wallLayer);
        
        this._itemLayer = new ItemLayer(itemTypes, probs);
        this._itemLayer.x = CFG.marginX;
        this._itemLayer.y = CFG.marginY;
        this._itemLayer.width = CFG.groundW;
        this._itemLayer.height = CFG.groundH;
        this.addChild(this._itemLayer, CFG.itemsZ);
    },
    
    update: function(dt) {
        var distance = 0, tarPos = this.hero.getPosition(), x, y,
            items = this._itemLayer.children, i, l, item,
            children = this.children, child;
        
        if (this.nextItemCount == 0) {
            this._itemLayer.addItem();
            this.nextItemCount = easyRandom(CFG.itemInterval, CFG.itemInterval);
        }
        this.nextItemCount--;
        
        for (i = 0, l = items.length; i < l; ++i) {
            item = items[i];
            if (!item.isItem) continue;
            x = tarPos.x - (item._position.x + CFG.marginX);
            y = tarPos.y - (item._position.y + CFG.marginY);
            distance = Math.round(Math.sqrt(x * x + y * y));
            
            // Collision detected
            if (distance < item.width) {
                this.hero.getItem(item);
                break;
            }
        }
        
        for (i = 0, l = children.length; i < l; ++i) {
            child = children[i];
            child.update && child.update(dt);
        }
    },
    
    cleanUp: function() {
        var i, l, children = this.children;
        for (i = children.length-1; i >= 0; --i) {
            child = children[i];
            child == this._wallLayer || child.removeFromParent(true);
        }
    }
});