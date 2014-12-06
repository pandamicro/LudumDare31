var GameScene = cc.Scene.extend({
    _room: null,
    _downRoom: null,
    _hero: null,
    _enemyLayer: null,
    _uiLayer: null,
    
    ctor: function() {
        this._super();
        
        this._room = new RoomLayer();
        this.addChild(this._room, 1);
        
        this._hero = new Hero();
        this.addChild(this._hero, 3);
        this._hero.x = cc.winSize.width/2;
        this._hero.y = cc.winSize.height/2;
        
        this._enemyLayer = new EnemyLayer(this._hero);
        this._enemyLayer.x = CFG.marginX;
        this._enemyLayer.y = CFG.marginY;
        this._enemyLayer.width = CFG.groundW;
        this._enemyLayer.height = CFG.groundH;
        this.addChild(this._enemyLayer, 4);
        for (var i = 0; i < 10; i++)
             this._enemyLayer.addEnemy(Enemy);
        
        this.scheduleUpdate();
        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function(touches, event) {
                event.getCurrentTarget().breakDown();
            }
        }, this);
    },
    
    update: function(dt) {
        this._hero.update(dt);
        this._enemyLayer.update(dt);
    },
    
    breakDown: function() {
        this._downRoom && this._downRoom.removeFromParent(true);
        this._downRoom = new RoomLayer();
        this._downRoom.scaleX = CFG.inScaleX;
        this._downRoom.scaleY = CFG.inScaleY;
        this.addChild(this._downRoom, 0);
        
        this._room._tiledLayer.breakDown();
        
        this._room.runAction(
            cc.sequence(
                cc.delayTime(CFG.tileBreakTime),
                cc.callFunc(this.preScale, this),
                cc.scaleTo(1, 1.3, 2),
                cc.callFunc(this.transitionDone, this)
            )
        );
    },
    
    preScale: function() {
        // Clean up the room
        this._room._tiledLayer.removeFromParent(true);
        this._downRoom.runAction(cc.scaleTo(1, 1));
    },
    
    transitionDone: function() {
        var temp = this._room;
        this._room = this._downRoom;
        this._room.zIndex = 1;
        this._downRoom = temp;
        this._downRoom.zIndex = 2;
    }
});