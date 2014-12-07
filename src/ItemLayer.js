var ItemLayer = cc.Layer.extend({
    itemTypes: null,
    probs: null,
    ctor: function(itemTypes, probs) {
        this._super();
        this.itemTypes = itemTypes;
        this.probs = probs;
    },
    
    addItem: function() {
        var item, type, x, y, i, l, r = Math.random();
        for (i = 0, l = this.itemTypes.length; i < l; ++i) {
            if (r < this.probs[i]) {
                type = this.itemTypes[i];
                break;
            }
        }
        
        if (!type)
            return;
        
        item = new type();
        this.addChild(item);
        item.x = item.width/2 + Math.round(Math.random() * this.width - item.width);
        item.y = item.height/2 + Math.round(Math.random() * this.height - item.height);
    }
});