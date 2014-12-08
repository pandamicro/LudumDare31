var UILayer = cc.LayerColor.extend({
    hp: null,
    item: null,
    unitHp: 204/100,
    ctor: function() {
        this._super(cc.color(255,255,255,120));
        this.x = CFG.width/2 - 250;
        this.y = CFG.height - 120;
        this.width = 500;
        this.height = 120;
        this.anchorX = 0;
        this.anchorY = 0;
        
        var life = new cc.Sprite("#ui_life.png");
        life.attr({
            x: 28,
            y: 60,
            anchorX: 0,
            anchorY: 0.5
        });
        this.addChild(life, 1);
        
        var itemFr = new cc.Sprite("#ui_item.png");
        itemFr.attr({
            x: 472,
            y: 60,
            anchorX: 1,
            anchorY: 0.5
        });
        this.addChild(itemFr, 1);
        this.item = new cc.Sprite();
        this.item.x = itemFr.width/2;
        this.item.y = itemFr.height/2;
        itemFr.addChild(this.item);
        
        this.hp = new cc.LayerColor(cc.color(220, 40, 0, 200));
        this.hp.attr({
            x: 113,
            y: 41,
            width: 204,
            height: 38
        });
        this.addChild(this.hp, 0);
        
        // font definition
        this.fontShadow = new cc.FontDefinition();
        this.fontShadow.fontName = "Verdana";
        this.fontShadow.fontSize = 32;
        this.fontShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.fontShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        this.fontShadow.fillStyle = cc.color(255, 255, 255);
        this.fontShadow.boundingWidth = 500;
	    this.fontShadow.boundingHeight = 400;
        
        var title = new cc.Sprite(res.title_jpg);
        title.x = this.width/2;
        title.y = CFG.height/2 - CFG.height + 120;
        this.addChild(title, 30);
        
        // create the label using the definition
        var info = new cc.LabelTTF("Ludum Dare #31\nAuthor: Huabin LING @pandamicro\nPowered by Cocos2d-JS\n\nDesktop only, use arrow keys to move, space to use items.", this.fontShadow);
        info.anchorX = 0.5;
        info.anchorY = 1;
        info.x = this.width/2;
        info.y = -350;
        
        this.addChild(info, 31);
        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan : function(touch, event) {
                return true;
            },
            onTouchEnded : function(touch, event) {
                info.removeFromParent(true);
                title.runAction(cc.sequence(
                    cc.spawn(
                        cc.scaleTo(2, 2),
                        cc.fadeOut(2)
                    ),
                    cc.callFunc(title.removeFromParent, title)
                ));
                cc.eventManager.removeListener(this);
            }
        }, title);
    },
    
    setItem: function(tex, texRect, rotated) {
        if (tex == null) {
            this.item.setTexture(null);
            this.item.setTextureRect(cc.rect(0, 0, 0, 0), false, cc.size(0, 0));
        }
        else {
            this.item.setTexture(tex);
            this.item.setTextureRect(texRect, rotated);
        }
    },
    
    setHp: function(hp) {
        this.hp.width = hp * this.unitHp;
    },
    
    addInfo: function() {
        // create the label using the definition
        var author = new cc.LabelTTF("Ludum Dare #31\nPhantom Tower: Classics\nAuthor: Huabin LING @pandamicro\nPowered by Cocos2d-JS", this.fontShadow);
        author.anchorX = 0.5;
        author.anchorY = 1;
        author.x = this.width/2;
        author.y = -400;
        
        this.addChild(author);
    },
    
    win: function() {
        var label = new cc.Sprite(res.win_png);
        label.scale = 2;
        label.x = this.width/2;
        label.y = label.height;
        
        label.runAction(cc.moveTo(1, this.width/2, -180));
        this.addChild(label, 3);
        
        this.addInfo();
    },
    lost: function() {
        var label = new cc.Sprite(res.lost_png);
        label.scale = 2;
        label.x = this.width/2;
        label.y = label.height;
        
        label.runAction(cc.sequence(
            cc.moveTo(1, this.width/2, -180),
            cc.delayTime(0.5),
            cc.rotateTo(0.15, 15)
        ));
        this.addChild(label, 3);
        
        var retry = new cc.Sprite("#replay.png");
        retry.x = this.width/2;
        retry.y = -300;
        this.addChild(retry);
        
        var rect = retry.getBoundingBoxToWorld();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan : function(touch, event) {
                if (cc.rectContainsPoint(rect, touch.getLocation())) {
                    return true;
                }
            },
            onTouchEnded : function(touch, event) {
                if (cc.rectContainsPoint(rect, touch.getLocation())) {
                    window.location.reload();
                    return true;
                }
            }
        }, retry);
        
        this.addInfo();
    }
});