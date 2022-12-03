// -----JS CODE-----
//@input Asset.Material boxMaterial
//@input SceneObject box
//@input Component.Camera camera
//@input Component.DeviceTracking device
//@input Component.RenderMeshVisual worldMesh
//@input float h
//@input float dt
//@input float e
//@input float time

// Defaults
global.matrixShape = 7;
global.heatnessSource_X = 3;
global.heatnessSource_Y = 3;
global.heatnessSource_Z = 3;
global.heatnessValue = 1;
global.spawn = false;

global.matrix = [];
for(var i=0; i < global.matrixShape; i++) {
    global.matrix[i] = [];
    for(var j=0; j < global.matrixShape; j++)
        global.matrix[i][j] = new Array(global.matrixShape);
}
    
global.heatness = [];
for(var i=0; i < global.matrixShape; i++) {
    global.heatness[i] = [];
    for(var j=0; j < global.matrixShape; j++) {
        global.heatness[i][j] = [];
        for(var k=0; k < global.matrixShape; k++) {
            global.heatness[i][j][k] = 0;
        }
    }
}

global.setMatrixes = function() {
    delete global.matrix;
    delete global.heatness;
    global.matrix = [];
    for(var i=0; i < global.matrixShape; i++) {
        global.matrix[i] = [];
        for(var j=0; j < global.matrixShape; j++)
            global.matrix[i][j] = new Array(global.matrixShape);
    }
    
    global.heatness = [];
    for(var i=0; i < global.matrixShape; i++) {
        global.heatness[i] = [];
        for(var j=0; j < global.matrixShape; j++) {
            global.heatness[i][j] = [];
            for(var k=0; k < global.matrixShape; k++) {
                global.heatness[i][j][k] = 0;
            }
        }
}
}


global.startVisualization = function() {
    global.spawn = true;
    
    var centerOfScreenPos = new vec2(0.5, 0.5);
    if (global.WorldMeshController.isInitialize) {
        var rayCastRes = global.WorldMeshController.getHitTestResult(centerOfScreenPos);
        if (!rayCastRes.isValid()) {
            return;
        } else if (rayCastRes.getClassification() == 4) {
            global.textLogger.clear();
            var pos = rayCastRes.getWorldPos();
            var substractValue = global.matrixShape/2 * 3.5;
            createMatrix(pos.x-substractValue, pos.y, pos.z-substractValue, global.matrixShape);
            
            global.heatness[global.heatnessSource_X][global.heatnessSource_Y][global.heatnessSource_Z] = global.heatnessValue;
            for (var t = 0; t < script.time; t++) {
                    global.heatness = spreadHeatness(script.h, script.dt, script.e);
            } 
        } else {
            global.logToScreen("Wrong suface: " + rayCastRes.getClassification());
        }
    }
}

function addNewObject(x, y, z) {
    var newSceneObject = global.scene.createSceneObject("Object");
    var visualComponent = script.box.getComponent("Component.MaterialMeshVisual")
    newSceneObject.copyComponent(visualComponent);
    newSceneObject.getTransform().setWorldPosition(new vec3(x, y, z));
    var scale = 0.25;
    newSceneObject.getTransform().setWorldScale(new vec3(scale, scale, scale));
    
    newSceneObject.getComponent("Component.MaterialMeshVisual").clearMaterials();
    newSceneObject.getComponent("Component.MaterialMeshVisual").addMaterial(visualComponent.getMaterial(0).clone());

    return newSceneObject;
}

function createMatrix(startX, startY, startZ, shape) {  
    scale_factor = 3.5;
    var scaleY = 0;
    for(i = 0; i < global.matrixShape; i++) {
        var scaleX = 0;
        for(j = 0; j < global.matrixShape; j++) {
            var scaleZ = 0;
            for(k = 0; k < global.matrixShape; k++) { 
                global.matrix[i][j][k] = addNewObject(startX+j+scaleX, startY+i+scaleY, startZ+k+scaleZ); 
                scaleZ = scaleZ + scale_factor;            
            }
            scaleX = scaleX + scale_factor;
        }
        scaleY = scaleY + scale_factor;
    } 
}

function spreadHeatness(h, dt, e) {
    var newHeatness = global.heatness.map(function(arr) {
        return arr.slice();
    });
    
    for (var x = 1; x < global.heatness.length-1; x++) {
        for (var y = 1; y < global.heatness.length-1; y++) {
            for (var z = 1; z < global.heatness.length-1; z++) {
				dx2 = e * ((global.heatness[x+1][y][z] - 2*global.heatness[x][y][z] + global.heatness[x-1][y][z]) / (h*h));
				dy2 = e * ((global.heatness[x][y+1][z] - 2*global.heatness[x][y][z] + global.heatness[x][y-1][z]) / (h*h)); 
				dz2 = e * ((global.heatness[x][y][z+1] - 2*global.heatness[x][y][z] + global.heatness[x][y][z-1]) / (h*h)); 
                
                wx_v = 0;
                wy_v = 0;
                wz_v = 0;
                wx = wx_v * e *(global.heatness[x+1][y][z] - global.heatness[x-1][y][z])/2*h;            
                wy = wy_v * e *(global.heatness[x][y+1][z] - global.heatness[x][y-1][z])/2*h;
                wz = wz_v * e *(global.heatness[x][y][z+1] - global.heatness[x][y][z-1])/2*h;
                
				var new_color = global.heatness[x][y][z] + dt * (dx2 + dy2 + dz2 - wx - wy -wz);
    
				if (x == global.heatnessSource_X && y == global.heatnessSource_Y && z == global.heatnessSource_Z) {                        
					new_color = new_color + global.heatnessValue;
				}
				newHeatness[x][y][z] = new_color;
				
            }
        }
    }

    return newHeatness;
}