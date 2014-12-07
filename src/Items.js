var Bullet = cc.Sprite.extend({
    speedX: 0, 
    speedY: 0,
    dead: false,
    damage: 0,
    type: "bullet",
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
            dx, dy, distance, nopower, collide;
        x += this.speedX;
        y += this.speedY;
        
        for (i = 0, l = enemies.length; i < l; ++i) {
            enemy = enemies[i];
            collide = false;
            if (enemy.checkIntersection) {
                collide = enemy.checkIntersection(x, y);
            }
            else {
                tarPos = enemy.getPosition();
                dx = tarPos.x - x;
                dy = tarPos.y - y;
                distance = Math.round(Math.sqrt(dx * dx + dy * dy));
                if (distance < this.width)
                    collide = true;
            }
            if (collide) {
                nopower = enemy.hurt(this.damage, this);
                if (nopower) {
                    this.dead = true;
                    this.scheduleOnce(this.removeFromParent, 0);
                    return;
                }
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
        this.addChild(frame, -1, CFG.frameTag);
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
        bullet.type = "fire";
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
        this._super("#pacman.png");
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
var Bean = Item.extend({
    ctor: function() {
        this._super("#bean.png");
        this.setFrame("#frame.png");
    },
    
    fire: function(x, y, speedX, speedY) {
        GameScene.instance._hero.hasBean = true;
    }
});
var MasterBlade = Item.extend({
    ctor: function() {
        this._super("#master_blade.png");
        this.isWeapon = true;
    },
    
    fire: function(x, y, speedX, speedY) {
        var bullet = new Bullet("#blade_wave.png");
        bullet.x = x;
        bullet.y = y;
        bullet.speedX = CFG.bulletSpeed * speedX;
        bullet.speedY = CFG.bulletSpeed * speedY;
        if (bullet.speedX > 0)
            bullet.flippedX = true;
        else if (bullet.speedY > 0)
            bullet.rotation = 90;
        else if (bullet.speedY < 0)
            bullet.rotation = 270;
        bullet.damage = CFG.bladeDamage;
        GameScene.instance.addChild(bullet, CFG.bulletZ);
    }
});
var ContraSArmor = Item.extend({
    angleInterval: Math.PI * 15 / 180,
    ctor: function() {
        this._super("#s_bullet.png");
        this.isWeapon = true;
        this.setFrame("#frame.png");
    },
    
    fire: function(x, y, speedX, speedY) {
        var bullet, i,
            speedX = CFG.bulletSpeed * speedX,
            speedY = CFG.bulletSpeed * speedY,
            speed = Math.abs(speedX != 0 ? speedX : speedY),
            angle, sx, sy;
        
        if (speedX > 0)
            angle = -2 * this.angleInterval;
        else if (speedX < 0)
            angle = Math.PI - 2 * this.angleInterval;
        else if (speedY > 0)
            angle = Math.PI/2 - 2 * this.angleInterval;
        else if (speedY < 0)
            angle = Math.PI*3/2 - 2 * this.angleInterval;
        
        
        for (i = 0; i < 5; ++i) {
            sx = speed * Math.cos(angle);
            sy = speed * Math.sin(angle);
            angle += this.angleInterval;
            
            bullet = new Bullet("#bullet.png");
            bullet.x = x;
            bullet.y = y;
            bullet.speedX = sx;
            bullet.speedY = sy;
            bullet.damage = CFG.bulletDamage;
            GameScene.instance.addChild(bullet, CFG.bulletZ);
        }
    }
})

var Crystal = cc.Sprite.extend({
    isItem: true,
    fire: function(x, y, speedX, speedY) {
        GameScene.instance.getCrystal(this);
    }
});

var Princess = Crystal.extend({
    fire: function(x, y, speedX, speedY) {
        GameScene.instance._hero.stand();
        GameScene.instance.win();
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
        var s = this.scale,
            w = this._contentSize.width * s,
            h = this._contentSize.height * s;
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
                
                this.setSpriteFrame("static_wall.png");
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
            GameScene.instance._enemyLayer.removeChild(this.walls[i]);
        }
        this.walls = [];
        this._super();
    },
    // Function of wall
    wallHurt: function(damage) {
        this.removeFromParent(true);
        return true;
    }
});

var PacmanEnemy = Crystal.extend({    
    canGet: function() {
        var hero = GameScene.instance._hero;
        if (hero.hasBean) {
            hero.hasBean = false;
            return true;
        }
        else {
            hero.hurt(CFG.Enemy.damage);
            return false;
        }
    }
});

var Heart = Crystal.extend({
    ctor: function() {
        this._super("#heart_s.png");
        GameScene.instance.addCrystal(this);
        
        if (!Heart.bigHeart) {
            Heart.bigHeart = new Crystal("#heart.png");
            Heart.bigHeart.x = cc.winSize.width/2 - CFG.marginX;
            Heart.bigHeart.y = cc.winSize.height/2 - CFG.marginY;
            Heart.bigHeart.visible = false;
            GameScene.instance.addCrystal(Heart.bigHeart);
        }
    },
    fire: function(x, y, speedX, speedY) {
        Heart.count ++;
        GameScene.instance.getCrystal(this);
        if (Heart.count == 3) {
            Heart.bigHeart.visible = true;
        }
    }
});
Heart.count = 0;
Heart.bigHeart = null;

var HeartBase = cc.Sprite.extend({
    leftBase: null,
    rightBase: null,
    leftFired: false,
    rightFired: false,
    heart: null,
    onEnter: function() {
        var fire, x = this.x, y = this.y;
        this._super();
        this.zIndex = CFG.roomZ;
        
        // Left
        fire = new Block("#firebase1.png");
        fire.x = x - (this.width + 50)/2;
        fire.y = y;
        fire.userData = this;
        GameScene.instance._enemyLayer.addChild(fire, CFG.fantomeZ-1);
        fire.hurt = this.fireHurt;
        this.leftBase = fire;
        // Right
        fire = new Block("#firebase1.png");
        fire.x = x + (this.width + 50)/2;
        fire.y = y;
        fire.userData = this;
        GameScene.instance._enemyLayer.addChild(fire, CFG.fantomeZ-1);
        fire.hurt = this.fireHurt;
        this.rightBase = fire;
        
        this.heart = new Heart();
        this.heart.x = this.x - CFG.marginX;
        this.heart.y = this.y - CFG.marginY;
        this.heart.visible = false;
    },
    onExit: function() {
        GameScene.instance._enemyLayer.removeChild(this.leftBase);
        GameScene.instance._enemyLayer.removeChild(this.rightBase);
        this.leftBase = this.rightBase = null;
        this._super();
    },
    fired: function(target) {
        if (target == this.leftBase)
            this.leftFired = true;
        else if (target == this.rightBase)
            this.rightFired = true;
        
        // Generate heart
        if (this.leftFired && this.rightFired) {
            this.heart.visible = true;
            this.heart.runAction(cc.fadeIn(0.5));
        }
    },
    // Function of fire
    fireHurt: function(damage, bullet) {
        if (this.userData && bullet.type == "fire") {
            this.setSpriteFrame("firebase3.png");
            this.userData.fired(this);
            this.userData = null;
        }
        return false;
    }
});

var ContraWall = Block.extend({
    hp: CFG.contraWallHP,
    onEnter: function() {
        this._super();
        this.scale = 2;
        GameScene.instance.enemies.push(this);
        this.zIndex = CFG.objZ + 1;
    },
    hurt: function(damage, bullet) {
        if (this.hp > 0) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.runAction(cc.sequence(
                    cc.fadeOut(1),
                    cc.callFunc(this.removeFromParent, this)
                ))
            }
        }
        return true;
    },
    checkIntersection: function (x, y) {
        var s = this.scale,
            sw = this.width * s,
            sh = this.height * s,
            sx = this.x - sw/2,
            sy = this.y - sh/2;
        if (x > sx && x < sx + sw && y > sy && y < sy + sh)
            return true;
        else return false;
    }
});

var ContraArmorBase = cc.Sprite.extend({
    count: CFG.contraArmorInterval,
    activated: false,
    hp: CFG.contraArmorBaseHP,
    onEnter: function() {
        this._super();
        GameScene.instance.enemies.push(this);
        this.zIndex = CFG.itemsZ-1;
    },
    update: function () {
        if (this.activated) {
            if (this.count <= 0) {
                this.count = easyRandom(CFG.contraArmorInterval, CFG.contraArmorInterval);
                this.generateArmor();
            }
            this.count--;
        }
    },
    activate: function() {
        var enemies = GameScene.instance.enemies,
            id = enemies.indexOf(this);
        if (id != -1)
            enemies.splice(id, 1);
        
        this.setSpriteFrame("static_wall.png")
        this.activated = true;
    },
    generateArmor: function() {
        var armor = new ContraSArmor();
        armor.x = this.x - CFG.marginX;
        armor.y = this.y - CFG.marginY;
        GameScene.instance._room._itemLayer.addChild(armor, CFG.itemsZ);
    },
    hurt: function(damage, bullet) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.activate();
        }
        return true;
    },
    checkIntersection: function (x, y) {
        var sw = this.width,
            sh = this.height,
            sx = this.x - sw/2,
            sy = this.y - sh/2;
        if (x > sx && x < sx + sw && y > sy && y < sy + sh)
            return true;
        else return false;
    }
});