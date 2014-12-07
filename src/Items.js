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