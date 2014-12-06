var Tile = cc.Sprite.extend({
    ctor: function(tex, texRect, width, height) {
        this._super(tex, texRect);
        this.scaleX = width / tex.width;
        this.scaleY = height / tex.height;
    }
});

var TiledLayer = cc.Layer.extend({
    _row: 0,
    _col: 0,
    _tw : 0,
    _th : 0,
    _batchNode: null,
    _tex : null,
    
    ctor: function(width, height, col, row) {
        var r, c, tile, tex, rect, tw, th, anchor = cc.p(0, 0);
        
        this._super();
        this._row = row;
        this._col = col;
        tw = this._tw = Math.floor(width / this._col);
        th = this._th = Math.floor(height / this._row);
        
        tex = this._tex = cc.textureCache.addImage(res.tile_png);
        rect = cc.rect(0, 0, 70, 70);
        this._batchNode = new cc.SpriteBatchNode(tex, row * col);
        for (r = 0; r < row; ++r) {
            for (c = 0; c < col; ++c) {
                tile = new Tile(tex, rect, tw, th);
                tile.x = c * tw + tw/2;
                tile.y = r * th + th/2;
                this._batchNode.addChild(tile);
            }
        }
        
        this.addChild(this._batchNode);
    },
    
    breakDown: function() {
        var tiles = this._batchNode.children, i, l, tile;
        
        for (i = 0, l = tiles.length; i < l; ++i) {
            tile = tiles[i];
            tile.runAction(cc.scaleTo(CFG.tileBreakTime, 0));
        }
    }
});