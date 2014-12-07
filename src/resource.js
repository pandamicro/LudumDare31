var winType = Math.floor(Math.random() * 2);

var res = {
    //tile_png : "res/tile.png",
    title_jpg : "res/menuscene.jpg",
    wall_png : "res/wall.png",
    //hero_png : "res/hero.png",
    //enemy_png : "res/fantome.png",
    items_plist : "res/items.plist",
    items_png : "res/items.png",
    win_png : winType ? "res/win1.png" : "res/win0.png",
    lost_png : "res/gameover.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}