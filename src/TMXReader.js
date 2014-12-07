
var cachedObjs = {};

var TMXReader = cc.Class.extend({
    layerClass : {
    },

    nodeClass : {
    },

    read : function(tmxfile) {
        var map = cc.TMXTiledMap.create(tmxfile);
        var mapW = map.mapWidth * map.tileWidth, mapH = map.mapHeight * map.tileHeight;

        cachedObjs = {};

        var groups = map.getObjectGroups(), group, gname, layerClass, nodeClass, objs, obj, i, j, l, n, layers = [], layer, node;
        for (i = 0, l = groups.length; i < l; i++) {
            group = groups[i];
            gname = group.getGroupName();
            layerClass = group.propertyNamed("className");
            if (layerClass == "null") {
                layer = [];
            }
            else if (layerClass) {
                nodeClass = this.nodeClass[layerClass];
                layerClass = window[layerClass] || cc.Layer;
                layer = new layerClass();
            }
            else {
                layerClass = cc.Layer;
                layer = new layerClass();
            }

            layer && layers.push(layer);

            objs = group.getObjects();
            for (j = 0, n = objs.length; j < n; j++) {
                obj = objs[j];
                obj.mapW = mapW;
                obj.mapH = mapH;

                if (nodeClass) {
                    node = new nodeClass(obj);
                }
                else {
                    var type = window[obj.type];
                    if (typeof type == "function") {
                        node = new type(obj);
                    }
                    else if (obj.type == "LabelTTF" && obj.string) {
                        node = new cc.LabelTTF(obj.string, "Symbol", 18, cc.size(obj.width, obj.height), cc.TEXT_ALIGNMENT_LEFT);
                        node.x = obj.x;
                        node.y = obj.y;
                        node.color = cc.color(173, 184, 178, 255);
                        node.anchorX = node.anchorY = 0;
                    }
                    else node = new Wall(obj);
                }

                if(obj.name) {
                    cachedObjs[obj.name] = node;
                }

                if (layer instanceof cc.Node) {
                    node && layer.addChild(node);
                }
                else if (layer) {
                    node && layer.push(node);
                }
                node = null;
            }
            nodeClass = null;
            layerClass = null;
            layer = null;
        }

        var res = {
            "mapW" : mapW,
            "mapH" : mapH,
            "layers" : layers
        };
        var props = map.getProperties();
        for (var i in props) {
            if (res[i] === undefined) {
                res[i] = props[i];
            }
        }
        return res;
    }
});