var Levels = [
    {
        itemTypes: [], 
        itemProbs: [],
        enemyCount: 0,
        objs: [
            {
                tex : "#crystal.png",
                type : Crystal,
                pos : [650, 450]
            }
        ]
    },
    // Mario
    {
        itemTypes: [Flower, Timer], 
        itemProbs: [0.8, 0.9],
        enemyCount: 3,
        objs: [
            {
                tex : "#magic_wall.png",
                type : MagicWall,
                pos : [600, 250]
            },
            {
                tex : "#magic_wall.png",
                type : MagicWall,
                pos : [200, 450]
            },
            {
                tex : "#sand_wall.png",
                type : Block,
                pos : [354, 450]
            },
            {
                tex : "#sand_wall.png",
                type : Block,
                pos : [431, 450]
            },
            {
                tex : "#sand_wall.png",
                type : Block,
                pos : [508, 450]
            },
            {
                tex : "#static_wall.png",
                type : Block,
                pos : [585, 450]
            },
            {
                tex : "#sand_wall.png",
                type : Block,
                pos : [662, 450]
            }
        ]
    },
    // Tank
    {
        itemTypes: [Armor, Shell, Timer],
        itemProbs: [0.8, 0.9, 1],
        enemyCount: 5,
        objs: [
            {
                tex : "#home.png",
                type : TankHome,
                pos : [130, 100]
            },
            {
                tex : "#home.png",
                type : TankHome,
                pos : [800, 200]
            }
        ]
    },
    // Pacman
    {
        itemTypes: [Pacman, Shell, Timer, Bean],
        itemProbs: [0.45, 0.55, 0.62, 1],
        enemyCount: 6,
        objs: [
            {
                tex : "#pac_enemy.png",
                type : PacmanEnemy,
                pos : [100, 60]
            },
            {
                tex : "#pac_enemy1.png",
                type : PacmanEnemy,
                pos : [100, 472]
            },
            {
                tex : "#pac_enemy2.png",
                type : PacmanEnemy,
                pos : [832, 60]
            },
            {
                tex : "#pac_enemy3.png",
                type : PacmanEnemy,
                pos : [832, 472]
            }
        ]
    },
    // Zelda
    {
        itemTypes: [MasterBlade, Flower, Timer],
        itemProbs: [0.3, 0.8, 1],
        enemyCount: 7,
        objs: [
            {
                tex : "#static_wall.png",
                type : HeartBase,
                pos : [220, 320]
            },
            {
                tex : "#static_wall.png",
                type : HeartBase,
                pos : [600, 550]
            },
            {
                tex : "#static_wall.png",
                type : HeartBase,
                pos : [980, 320]
            }
        ]
    },
    // Contra
    {
        itemTypes: [Armor, Shell, Timer],
        itemProbs: [0.7, 0.8, 0.9],
        enemyCount: 9,
        objs: [
            {
                tex : "#contra_wall.png",
                type : ContraWall,
                pos : [900, 400]
            },
            {
                tex : "#armor_block.png",
                type : ContraArmorBase,
                pos : [200, 400]
            },
            {
                tex : CFG.winType ? "#princess.png" : "#mashroom2.png",
                type : Princess,
                pos : [850, 400]
            }
        ]
    }
];

var GameScene = cc.Scene.extend({
    _room: null,
    _downRoom: null,
    _hero: null,
    _enemyLayer: null,
    //_magicBalls: null,
    uiLayer: null,
    
    _breaking: false,
    enemies: [],
    crystals: [],
    _level: -1,
    
    itemTypes: [],
    itemProbs: [],
    enemyCount: 0,
    objs: [],
    
    stopped: false,
    
    ctor: function() {
        this._super();
        
        cc.spriteFrameCache.addSpriteFrames(res.items_plist, res.items_png);
        
        this._hero = new Hero();
        this.addChild(this._hero, CFG.heroZ);
        this._hero.x = cc.winSize.width/2;
        this._hero.y = cc.winSize.height/2;
        
        this.levelUp();
        
        this._room = new RoomLayer(this._hero, this.itemTypes, this.itemProbs);
        this.addChild(this._room, CFG.roomZ);
        
        this._enemyLayer = new EnemyLayer(this._hero);
        //this._enemyLayer.x = CFG.marginX;
        //this._enemyLayer.y = CFG.marginY;
        this._enemyLayer.width = CFG.width;
        this._enemyLayer.height = CFG.height;
        this.addChild(this._enemyLayer, 10);
        this.addEnemies(this.enemyCount);
        
        this.uiLayer = new UILayer();
        this.addChild(this.uiLayer, 20);

        this.initObjs();
        
        this.scheduleUpdate();
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
    },
    
    initObjs: function() {
        var objs = this.objs, i, l, obj, node;
        for (i = 0, l = objs.length; i < l; ++i) {
            obj = objs[i];
            node = obj.node = new obj.type(obj.tex);
            node.x = obj.pos[0];
            node.y = obj.pos[1];
                        
            if (node instanceof Crystal)
                this.addCrystal(node);
            else this.addObject(node);
        }
    },
    
    addCrystal: function (crystal, zIndex) {
        this._room._itemLayer.addChild(crystal, zIndex || CFG.objZ);
        this.crystals.push(crystal);
    },
    removeCrystal: function (crystal) {
        var id = this.crystals.indexOf(crystal);
        this.crystals.splice(id, 1);
        this._room._itemLayer.removeChild(crystal, true);
    },
    getCrystal: function (crystal) {
        var self = this;
        
        // Last one
        if (this.crystals.length == 1) {
            this.scheduleOnce(this.breakDown, 0);
        }
        else {
            this.scheduleOnce(function() {
                self.removeCrystal(crystal);
            }, 0);
        }
    },
    addObject: function (obj, zIndex) {
        this._room.addChild(obj, zIndex || CFG.objZ);
    },
    removeObject: function (obj) {
        this._room.removeChild(obj, true);
    },
    
    addEnemies: function (count) {
        for (var i = 0; i < count; i++)
             this._enemyLayer.addEnemy(Enemy);
        this.enemies = this._enemyLayer.children;
    },
    
    update: function(dt) {
        if (!this._breaking) {
            var children = this.children, i, child, downRoom = this._downRoom;
            for (i = children.length-1; i >= 0; --i) {
                child = children[i];
                child && child != downRoom && child.update && child.update(dt);
            }
        }
    },
    
    cleanUp: function() {
        var i, l;
        for (i = 0, l = this.crystals.length; i < l; ++i) {
            this._room.removeChild(this.crystals[i], true);
        }
        this.crystals = [];
        this.objs = [];
    },
    
    breakDown: function() {
        this._breaking = true;
        
        this.cleanUp();
        this.levelUp();
        
        this._downRoom && this._downRoom.removeFromParent(true);
        this._downRoom = this._room;
        this._room = new RoomLayer(this._hero, this.itemTypes, this.itemProbs);
        this._room.scaleX = CFG.inScaleX;
        this._room.scaleY = CFG.inScaleY;
        this.addChild(this._room, 0);

        this.initObjs();

        this._downRoom._tiledLayer.breakDown();
        this._downRoom.runAction(
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
        this._downRoom.cleanUp();
        this._room.runAction(cc.scaleTo(1, 1));
        this._hero.falling();
    },
    
    transitionDone: function() {
        this._room.zIndex = 1;
        this._downRoom.zIndex = 2;
        
        this.addEnemies(this.enemyCount);
        
        this._hero.landed();
        
        this._breaking = false;
    },
    
    gameOver: function() {
        if (!this.stopped) {
            this.stopped = true;
            cc.eventManager.removeAllListeners();
            this.removeChild(this._enemyLayer);
            this.uiLayer.lost();
        }
    },
    
    win: function() {
        if (!this.stopped) {
            this.stopped = true;
            cc.eventManager.removeAllListeners();
            this.removeChild(this._enemyLayer);
            this.uiLayer.win();
        }
    }
});
GameScene.instance = null;