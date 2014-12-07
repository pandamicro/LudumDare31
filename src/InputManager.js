var HeroKeyboardManager = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,

    onKeyPressed : function (keyCode, event) {
        var hero = event.getCurrentTarget();

        if (keyCode == 39 && !hero.goRight) {
            hero.goUp = false;
            hero.goDown = false;
            hero.goLeft = false;
            hero.goRight = true;
            hero.stopAllActions();
            hero.runAction(hero.rightAnime);
        }
        else if (keyCode == 37 && !hero.goLeft) {
            hero.goUp = false;
            hero.goDown = false;
            hero.goLeft = true;
            hero.goRight = false;
            hero.stopAllActions();
            hero.runAction(hero.leftAnime);
        }
        else if (keyCode == 38 && !hero.goUp) {
            hero.goUp = true;
            hero.goDown = false;
            hero.goLeft = false;
            hero.goRight = false;
            hero.stopAllActions();
            hero.runAction(hero.upAnime);
        }
        else if (keyCode == 40 && !hero.goDown) {
            hero.goUp = false;
            hero.goDown = true;
            hero.goLeft = false;
            hero.goRight = false;
            hero.stopAllActions();
            hero.runAction(hero.downAnime);
        }
        else if (keyCode == 32) {
            hero.shoot();
        }
    },
    onKeyReleased : function (keyCode, event) {
        var hero = event.getCurrentTarget();

        if (hero.goRight && keyCode == 39) {
            hero.stand();
        }
        else if (hero.goLeft && keyCode == 37) {
            hero.stand();
        }
        else if (hero.goUp && keyCode == 38) {
            hero.stand();
        }
        else if (hero.goDown && keyCode == 40) {
            hero.stand();
        }
    }
});