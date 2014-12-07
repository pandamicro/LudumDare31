var Tile = cc.Sprite.extend({
    ctor: function(tex, texRect, width, height) {
        this._super(tex, texRect);
        this.scaleX = width / texRect.width;
        this.scaleY = height / texRect.height;
    }
});

var TiledLayer = cc.Layer.extend({
    _row: 0,
    _col: 0,
    _tw : 0,
    _th : 0,
    _batchNode: null,
    _frame : null,
    _breakAnime : null,
    
    ctor: function(width, height, col, row) {
        var r, c, tile, tex, rect, tw, th, anchor = cc.p(0, 0), frames;
        
        this._super();
        this._row = row;
        this._col = col;
        tw = this._tw = Math.floor(width / this._col);
        th = this._th = Math.floor(height / this._row);
        
        this._frame = cc.spriteFrameCache.getSpriteFrame("tile1.png");
        tex = this._frame.getTexture();
        rect = this._frame.getRect();
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
        
        frames = [];
        for (r = 1; r < 6; r++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame("tile"+r+".png"));
        }
        this._breakAnime = new cc.Animation(frames, 0.1);
    },
    
    breakDown: function() {
        var tiles = this._batchNode.children, i, l, tile;
        
        for (i = 0, l = tiles.length; i < l; ++i) {
            tile = tiles[i];
            tile.runAction(cc.animate(this._breakAnime));
        }
    }
});