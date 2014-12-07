EnemyLayer = cc.Layer.extend({
    target: null,
    
    ctor: function(hero) {
        this._super();
        this.target = hero;
    },
    
    addEnemy: function(type) {
        var enemy = new type(this.target), 
            x, y;
        this.addChild(enemy);
        enemy.x = enemy.width/2 + Math.round(Math.random() * this.width - enemy.width);
        enemy.y = enemy.height/2 + Math.round(Math.random() * this.height - enemy.height);
        enemy.goAfter();
    },
    
    update: function(dt) {
        var enemies = this.children, i, l;
        
        for (i = 0, l = enemies.length; i < l; ++i) {
            enemies[i].update(dt);
        }
    }
});