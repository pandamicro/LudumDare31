var ItemLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
    },
    
    addItem: function(type) {
        var item = new type(), x, y;
        this.addChild(item);
        item.x = item.width/2 + Math.round(Math.random() * this.width - item.width);
        item.y = item.height/2 + Math.round(Math.random() * this.height - item.height);
    }
});