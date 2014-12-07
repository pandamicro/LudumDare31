var HeroKeyboardManager = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,

    onKeyPressed : function (keyCode, event) {
        var hero = event.getCurrentTarget();
        if (hero.isFalling) return;

        if (keyCode == 39 && !hero.faceRight) {
            hero.faceUp = false;
            hero.faceDown = false;
            hero.faceLeft = false;
            hero.faceRight = true;
            hero.walking = true;
            hero.stopAllActions();
            hero.runAction(hero.rightAnime);
        }
        else if (keyCode == 37 && !hero.faceLeft) {
            hero.faceUp = false;
            hero.faceDown = false;
            hero.faceLeft = true;
            hero.faceRight = false;
            hero.walking = true;
            hero.stopAllActions();
            hero.runAction(hero.leftAnime);
        }
        else if (keyCode == 38 && !hero.faceUp) {
            hero.faceUp = true;
            hero.faceDown = false;
            hero.faceLeft = false;
            hero.faceRight = false;
            hero.walking = true;
            hero.stopAllActions();
            hero.runAction(hero.upAnime);
        }
        else if (keyCode == 40 && !hero.faceDown) {
            hero.faceUp = false;
            hero.faceDown = true;
            hero.faceLeft = false;
            hero.faceRight = false;
            hero.walking = true;
            hero.stopAllActions();
            hero.runAction(hero.downAnime);
        }
        else if (keyCode == 32) {
            hero.shoot();
        }
    },
    onKeyReleased : function (keyCode, event) {
        var hero = event.getCurrentTarget();
        if (hero.isFalling) return;

        if (hero.faceRight && keyCode == 39) {
            hero.stand();
        }
        else if (hero.faceLeft && keyCode == 37) {
            hero.stand();
        }
        else if (hero.faceUp && keyCode == 38) {
            hero.stand();
        }
        else if (hero.faceDown && keyCode == 40) {
            hero.stand();
        }
    }
});