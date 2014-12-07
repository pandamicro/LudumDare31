var Levels = [
    {
        itemTypes: [], 
        itemProbs: [],
        enemyCount: 0
    },
    {
        itemTypes: [Flower, Timer], 
        itemProbs: [0.8, 0.9],
        enemyCount: 3
    },
    {
        itemTypes: [Armor, Shell, Timer],
        itemProbs: [0.7, 0.8, 0.9],
        enemyCount: 5
    },
    {
        itemTypes: [Pacman, Shell, Timer],
        itemProbs: [0.65, 0.75, 0.9],
        enemyCount: 5
    }
];

var GameScene = cc.Scene.extend({
    _room: null,
    _downRoom: null,
    _hero: null,
    _enemyLayer: null,
    //_magicBalls: null,
    _uiLayer: null,
    
    _breaking: false,
    enemies: [],
    _level: -1,
    
    itemTypes: [],
    itemProbs: [],
    enemyCount: 0,
    
    ctor: function() {
        this._super();
        
        cc.spriteFrameCache.addSpriteFrames(res.items_plist, res.items_png);
        
        this._hero = new Hero();
        this.addChild(this._hero, 3);
        this._hero.x = cc.winSize.width/2;
        this._hero.y = cc.winSize.height/2;
        
        this.levelUp();
        
        this._room = new RoomLayer(this._hero, this.itemTypes, this.itemProbs);
        this.addChild(this._room, 1);
        
        this._enemyLayer = new EnemyLayer(this._hero);
        //this._enemyLayer.x = CFG.marginX;
        //this._enemyLayer.y = CFG.marginY;
        this._enemyLayer.width = CFG.width;
        this._enemyLayer.height = CFG.height;
        this.addChild(this._enemyLayer, 4);
        this.addEnemies(this.enemyCount);
        
        this.scheduleUpdate();
        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function(touches, event) {
                event.getCurrentTarget().breakDown();
            }
        }, this);
    },
    
    levelUp: function() {
        var level, key;
        if (this._level < Levels.length-1) {
            this._level++;
            level = Levels[this._level];
            if (level) {
                for (key in level) {
                    this[key] = level[key];
                }
            }
        }
        else {
        }
    },
    
    addEnemies: function (count) {
        for (var i = 0; i < count; i++)
             this._enemyLayer.addEnemy(Enemy);
        this.enemies = this._enemyLayer.children;
    },
    
    update: function(dt) {
        if (!this._breaking) {
            var children = this.children, i, l, child, downRoom = this._downRoom;
            for (i = 0, l = children.length; i < l; ++i) {
                child = children[i];
                child != downRoom && child.update && child.update(dt);
            }
        }
    },
    
    breakDown: function() {
        this._breaking = true;
        
        this.levelUp();
        
        this._downRoom && this._downRoom.removeFromParent(true);
        this._downRoom = new RoomLayer(this._hero, this.itemTypes, this.itemProbs);
        this._downRoom.scaleX = CFG.inScaleX;
        this._downRoom.scaleY = CFG.inScaleY;
        this.addChild(this._downRoom, 0);
        
        this._room._tiledLayer.breakDown();
        
        this._room.runAction(
            cc.sequence(
                cc.delayTime(CFG.tileBreakTime),
                cc.callFunc(this.preScale, this),
                cc.scaleTo(1, CFG.outScaleX, CFG.outScaleY),
                cc.callFunc(this.transitionDone, this)
            )
        );
        
        this._hero.fall();
    },
    
    preScale: function() {
        // Clean up the room
        this._room.cleanUp();
        this._downRoom.runAction(cc.scaleTo(1, 1));
        this._hero.falling();
    },
    
    transitionDone: function() {
        var temp = this._room;
        this._room = this._downRoom;
        this._room.zIndex = 1;
        this._downRoom = temp;
        this._downRoom.zIndex = 2;
        
        this.addEnemies(this.enemyCount);
        
        this._hero.landed();
        
        this._breaking = false;
    }
});
GameScene.instance = null;