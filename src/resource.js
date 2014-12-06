var res = {
    tile_png : "res/tile.png",
    wall_png : "res/wall.png",
    hero_png : "res/hero.png",
    enemy_png : "res/CloseNormal.png",
    item_png : "res/CloseSelected.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}