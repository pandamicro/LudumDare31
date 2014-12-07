var Bullet = cc.Sprite.extend({
    speedX: 0, 
    speedY: 0,
    dead: false,
    damage: 0,
    setAnimation: function(arr, interval) {
        var i, l, frame, frames = [], animation;
        for (i = 0, l = arr.length; i < l; ++i) {
            frame = cc.spriteFrameCache.getSpriteFrame(arr[i]);
            frames.push(frame);
        }
        animation = new cc.Animation(frames, interval);
        this.runAction(cc.animate(animation).repeatForever());
    },
    
    update: function() {
        if (this.dead) return;
        
        var x = this.x,
            y = this.y,
            enemies = GameScene.instance.enemies,
            i, l, tarPos, enemy, 
            dx, dy, distance;
        x += this.speedX;
        y += this.speedY;
        
        for (i = 0, l = enemies.length; i < l; ++i) {
            enemy = enemies[i];
            tarPos = enemy.getPosition();
            dx = tarPos.x - x;
            dy = tarPos.y - y;
            distance = Math.round(Math.sqrt(dx * dx + dy * dy));
            if (distance < this.width) {
                this.dead = true;
                this.scheduleOnce(this.removeFromParent, 0);
                enemy.hurt(this.damage);
                return;
            }
        }
        
        if (x > CFG.width || x < 0 || y > CFG.height || y < 0) {
            this.dead = true;
            this.scheduleOnce(this.removeFromParent, 0);
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
});

var Item = cc.Sprite.extend({
    isItem: true,
    isWeapon: false,
    
    onEnter: function() {
        this._super();
        this.scheduleOnce(this.removeFromParent, easyRandom(CFG.itemDuration, CFG.itemDuration));
    },
    
    setFrame: function(tex) {
        var frame = new cc.Sprite(tex);
        frame.x = this.width/2;
        frame.y = this.height/2;
        this.addChild(frame, 0, CFG.frameTag);
    },
    
    fire: function() {}
});

var Armor = Item.extend({
    ctor: function() {
        this._super("#armor.png");
        this.isWeapon = true;
        this.setFrame("#frame.png");
    },
    
    fire: function(x, y, speedX, speedY) {
        var bullet = new Bullet("#bullet.png");
        bullet.x = x;
        bullet.y = y;
        bullet.speedX = CFG.bulletSpeed * speedX;
        bullet.speedY = CFG.bulletSpeed * speedY;
        bullet.damage = CFG.bulletDamage;
        GameScene.instance.addChild(bullet, CFG.bulletZ);
    }
});
var Shell = Item.extend({
    ctor: function() {
        this._super("#shell.png");
        this.setFrame("#frame.png");
    },
    
    fire: function() {
        var hero = GameScene.instance._hero;
        this.setFrame.call(hero, "#hero_frame.png");
        hero.unhurtable = true;
        hero.scheduleOnce(function() {
            hero.unhurtable = false;
            hero.getChildByTag(CFG.frameTag).removeFromParent(true);
        }, 5);
    }
});
var Timer = Item.extend({
    ctor: function() {
        this._super("#timer.png");
        this.setFrame("#frame.png");
    },
    
    fire: function() {
        var enemies = GameScene.instance.enemies;
        for (i = 0, l = enemies.length; i < l; ++i) {
            enemies[i].disabled = true;
        }
        GameScene.instance._hero.scheduleOnce(function() {
            var enemies = GameScene.instance.enemies;
            for (i = 0, l = enemies.length; i < l; ++i) {
                enemies[i].disabled = false;
            }
        }, 5);
    }
});
var Flower = Item.extend({
    ctor: function() {
        this._super("#flower.png");
        this.isWeapon = true;
        this.setFrame("#frame.png");
    },
    
    fire: function(x, y, speedX, speedY) {
        var bullet = new Bullet("#fire1.png");
        bullet.x = x;
        bullet.y = y;
        bullet.speedX = CFG.bulletSpeed * speedX;
        bullet.speedY = CFG.bulletSpeed * speedY;
        bullet.damage = CFG.flowerDamage;
        bullet.setAnimation(["fire1.png", "fire2.png", "fire3.png", "fire4.png"], 0.1);
        GameScene.instance.addChild(bullet, CFG.bulletZ);
    }
});
var Pacman = Item.extend({
    ctor: function() {
        this._super("#packman.png");
        this.isWeapon = true;
        this.setFrame("#frame.png");
    },
    
    fire: function(x, y, speedX, speedY) {
        var bullet = new Bullet("#pacman1.png");
        bullet.x = x;
        bullet.y = y;
        bullet.speedX = speedX;
        bullet.speedY = speedY;
        if (bullet.speedX < 0)
            bullet.flippedX = true;
        else if (bullet.speedY > 0)
            bullet.rotation = 270;
        else if (bullet.speedY < 0)
            bullet.rotation = 90;
        bullet.damage = CFG.pacmanDamage;
        bullet.setAnimation(["pacman1.png", "pacman2.png"], 0.3);
        GameScene.instance.addChild(bullet, CFG.bulletZ);
    }
});
var MasterBlade = Item.extend({
    ctor: function() {
        this._super("#master_blade.png");
        this.isWeapon = true;
        this.setFrame("#frame.png");
    },
    
    fire: function(x, y, speedX, speedY) {
        var bullet = new Bullet("#blade_wave.png");
        bullet.x = x;
        bullet.y = y;
        bullet.speedX = CFG.bulletSpeed * speedX;
        bullet.speedY = CFG.bulletSpeed * speedY;
        bullet.damage = CFG.bladeDamage;
        GameScene.instance.addChild(bullet, CFG.bulletZ);
    }
});

var Crystal = cc.Sprite.extend({
    isItem: true,
    fire: function(x, y, speedX, speedY) {
        GameScene.instance.getCrystal(this);
    }
});

var Block = cc.Sprite.extend({
    collision: false,
    onEnter: function() {
        this._super();
        GameScene.instance._hero.addCollisionObj(this);
    },
    onExit: function() {
        this._super();
        GameScene.instance._hero.removeCollisionObj(this);
    },
    getCollisionRect: function() {
        var w = this._contentSize.width,
            h = this._contentSize.height;
        return cc.rect(this._position.x + this.parent._position.x - w/2, 
                       this._position.y + this.parent._position.y - h/2,
                       w, h);
    }
});

var MagicWall = Block.extend({
    mashroom: null,
    onEnter: function() {
        this._super();
        this.mashroom = new Crystal("#mashroom.png");
        this.mashroom.x = this.x - CFG.marginX;
        this.mashroom.y = this.y - CFG.marginY + 5;
        GameScene.instance.addCrystal(this.mashroom, CFG.objZ-1);
        this.mashroom.visible = false;
    },
    update: function () {
        var hero, disX, disY, mashroom, x, y;
        if (this.collision) {
            hero = GameScene.instance._hero;
            disY = this.y - hero.y;
            disX = this.x - hero.x;
            // Valid collision
            if (disY > 0 && disY <= (this.width + hero.width + 4) / 2 && Math.abs(disX) < 20) {
                this.mashroom.visible = true;
                this.mashroom.runAction(cc.moveTo(0.5, this.mashroom.x, this.mashroom.y + (this.mashroom.height + this.height) / 2 - 5));
                
                // Cancel update
                this.update = null;
            }
            this.collision = false;
        }
    }
});

var TankHome = Crystal.extend({
    walls: null,
    onEnter: function() {
        var wall, x = this.x + CFG.marginX, y = this.y + CFG.marginY;
        this._super();
        
        this.walls = [];
        // Left
        wall = new Block("#sand_wall.png");
        wall.x = x - 77;
        wall.y = y;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // LeftTop
        wall = new Block("#sand_wall.png");
        wall.x = x - 77;
        wall.y = y + 62;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // LeftBottom
        wall = new Block("#sand_wall.png");
        wall.x = x - 77;
        wall.y = y - 62;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // Right
        wall = new Block("#sand_wall.png");
        wall.x = x + 77;
        wall.y = y;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // RightTop
        wall = new Block("#sand_wall.png");
        wall.x = x + 77;
        wall.y = y + 62;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // RightBottom
        wall = new Block("#sand_wall.png");
        wall.x = x + 77;
        wall.y = y - 62;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // CenterTop
        wall = new Block("#sand_wall.png");
        wall.x = x;
        wall.y = y + 62;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
        // CenterBottom
        wall = new Block("#sand_wall.png");
        wall.x = x;
        wall.y = y - 62;
        GameScene.instance._enemyLayer.addChild(wall);
        wall.hurt = this.wallHurt;
        this.walls.push(wall);
    },
    
    onExit: function() {
        var i, l;
        for (i = 0, l = this.walls.length; i < l; ++i) {
            GameScene.instance.removeObject(this.walls[i]);
        }
        this.walls = [];
        this._super();
    },
    // Function of wall
    wallHurt: function(damage) {
        this.removeFromParent(true);
    }
});

var PacmanEnemy = null;

var HeartBase = null;

var ContraWall = null;

var ContraArmor = null;