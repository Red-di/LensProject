// -----JS CODE-----
//@input Asset.Material boxMaterial
//@input SceneObject box
//@input Component.Camera camera
//@input Component.DeviceTracking device
//@input Component.RenderMeshVisual worldMesh
//@input int MatrixShape
//@input float h
//@input float dt
//@input float e
//@input float time
//@input int heatnessSource_X
//@input int heatnessSource_Y
//@input int heatnessSource_Z
//@input int heatnessValue

global.heatnessSource_X = script.heatnessSource_X;
global.heatnessSource_Y = script.heatnessSource_Y;
global.heatnessSource_Z = script.heatnessSource_Z;

global.matrix = [];
for(var i=0; i < script.MatrixShape; i++) {
    global.matrix[i] = [];
    for(var j=0; j < script.MatrixShape; j++)
        global.matrix[i][j] = new Array(script.MatrixShape);
}

global.heatness = [];
for(var i=0; i < script.MatrixShape; i++) {
    global.heatness[i] = [];
    for(var j=0; j < script.MatrixShape; j++) {
        global.heatness[i][j] = [];
        for(var k=0; k < script.MatrixShape; k++) {
            global.heatness[i][j][k] = 0;
        }
    }
}

var camera_coords = script.camera.getTransform().getWorldPosition();
createMatrix(camera_coords.x, camera_coords.y, camera_coords.z, script.MatrixShape);

global.heatness[script.heatnessSource_X][script.heatnessSource_Y][script.heatnessSource_Z] = script.heatnessValue;
var heatnessSource = [script.heatnessSource_X, script.heatnessSource_Y, script.heatnessSource_Z];
var renderMeshVisual = global.matrix[script.heatnessSource_X][script.heatnessSource_Y][script.heatnessSource_Z].getComponent("Component.RenderMeshVisual");


for (var t = 0; t < script.time; t++){
    spreadHeatness(script.h, script.dt, script.e, [script.heatnessSource_X, script.heatnessSource_Y, script.heatnessSource_Z]);
}

global.startTween();

function addNewObject(x, y, z) {
    var newSceneObject = global.scene.createSceneObject("Object");
    var visualComponent = script.box.getComponent("Component.MaterialMeshVisual")
    newSceneObject.copyComponent(visualComponent);
    newSceneObject.getTransform().setWorldPosition(new vec3(x, y, z));
    newSceneObject.getTransform().setWorldScale(new vec3(0.05, 0.05, 0.05));
    
    newSceneObject.getComponent("Component.MaterialMeshVisual").clearMaterials();
    newSceneObject.getComponent("Component.MaterialMeshVisual").addMaterial(visualComponent.getMaterial(0).clone());
    // var meshComp = newSceneObject.createComponent("Component.RenderMeshVisual");
    // meshComp.mesh = script.box.getComponent("Component.RenderMeshVisual").mesh;
    // meshComp.addMaterial(script.boxMaterial.clone());

    return newSceneObject;
}

function createMatrix(startX, startY, startZ, shape) {  
    var halfShape = Math.floor(shape/2);
    for(i = -halfShape; i < halfShape+1; i++) {
        for(j = -halfShape; j < halfShape+1; j++) {
            for(k = -halfShape; k < halfShape+1; k++) { 
                global.matrix[i+halfShape][j+halfShape][k+halfShape] = addNewObject(startX+i, startY+j, startZ+k);   
            }
        }  
    } 
}

function spreadHeatness(h, dt, e, centre) {
    var x = centre[0];
    var y = centre[1];
    var z = centre[2];
    
    calculateHeatness(h, dt, e, x, y, z);
    
    for (var i = 1; i < global.matrix.length/2-1; i++) {
        
        calculateHeatness(h, dt, e, x-i, y, z);
        
        calculateHeatness(h, dt, e, x, y+i, z);
        
        calculateHeatness(h, dt, e, x+i, y, z);
        
        calculateHeatness(h, dt, e, x, y-i, z);

        calculateHeatness(h, dt, e, x, y, z-i);

        calculateHeatness(h, dt, e, x, y, z+i);  
        
        for (var c = 0; c < i; c++) 
        {
            var a = i;
            var b = 1;
            for (b; b <= a; b++) {
                calculateHeatness(h, dt, e, x+a, y-b, z+c);
                calculateHeatness(h, dt, e, x+a, y+b, z+c);
                calculateHeatness(h, dt, e, x-a, y+b, z+c);
                calculateHeatness(h, dt, e, x-a, y-b, z+c);
                
                calculateHeatness(h, dt, e, x+c, y+a, z-b);
                calculateHeatness(h, dt, e, x+c, y+a, z+b);
                calculateHeatness(h, dt, e, x+c, y-a, z+b);
                calculateHeatness(h, dt, e, x+c, y-a, z-b);
        
                calculateHeatness(h, dt, e, x+a, y+c, z-b);
                calculateHeatness(h, dt, e, x+a, y+c, z+b);
                calculateHeatness(h, dt, e, x-a, y+c, z+b);
                calculateHeatness(h, dt, e, x-a, y+c, z-b);
            }
                
            
            var a = 1;
            var b = i;
            for (a; a <= b; a++) {
                calculateHeatness(h, dt, e, x+a, y-b, z+c);
                calculateHeatness(h, dt, e, x+a, y+b, z+c);
                calculateHeatness(h, dt, e, x-a, y+b, z+c);
                calculateHeatness(h, dt, e, x-a, y-b, z+c);
                
                calculateHeatness(h, dt, e, x+c, y+a, z-b);
                calculateHeatness(h, dt, e, x+c, y+a, z+b);
                calculateHeatness(h, dt, e, x+c, y-a, z+b);
                calculateHeatness(h, dt, e, x+c, y-a, z-b);
        
                calculateHeatness(h, dt, e, x+a, y+c, z-b);
                calculateHeatness(h, dt, e, x+a, y+c, z+b);
                calculateHeatness(h, dt, e, x-a, y+c, z+b);
                calculateHeatness(h, dt, e, x-a, y+c, z-b);
            }
            if (c != 0) {
               var a = i;
                var b = 1;
                for (b; b <= a; b++) {
                    calculateHeatness(h, dt, e, x+a, y-b, z-c);
                    calculateHeatness(h, dt, e, x+a, y+b, z-c);
                    calculateHeatness(h, dt, e, x-a, y+b, z-c);
                    calculateHeatness(h, dt, e, x-a, y-b, z-c);
                    
                    calculateHeatness(h, dt, e, x-c, y+a, z-b);
                    calculateHeatness(h, dt, e, x-c, y+a, z+b);
                    calculateHeatness(h, dt, e, x-c, y-a, z+b);
                    calculateHeatness(h, dt, e, x-c, y-a, z-b);
            
                    calculateHeatness(h, dt, e, x+a, y-c, z-b);
                    calculateHeatness(h, dt, e, x+a, y-c, z+b);
                    calculateHeatness(h, dt, e, x-a, y-c, z+b);
                    calculateHeatness(h, dt, e, x-a, y-c, z-b);
                }
                    
                
                var a = 1;
                var b = i;
                for (a; a <= b; a++) {
                    calculateHeatness(h, dt, e, x+a, y-b, z-c);
                    calculateHeatness(h, dt, e, x+a, y+b, z-c);
                    calculateHeatness(h, dt, e, x-a, y+b, z-c);
                    calculateHeatness(h, dt, e, x-a, y-b, z-c);
                    
                    calculateHeatness(h, dt, e, x-c, y+a, z-b);
                    calculateHeatness(h, dt, e, x-c, y+a, z+b);
                    calculateHeatness(h, dt, e, x-c, y-a, z+b);
                    calculateHeatness(h, dt, e, x-c, y-a, z-b);
            
                    calculateHeatness(h, dt, e, x+a, y-c, z-b);
                    calculateHeatness(h, dt, e, x+a, y-c, z+b);
                    calculateHeatness(h, dt, e, x-a, y-c, z+b);
                    calculateHeatness(h, dt, e, x-a, y-c, z-b);
                } 
            }
        }
      
        calculateHeatness(h, dt, e, x-i, y+i, z+i);
        
        calculateHeatness(h, dt, e, x+i, y+i, z+i);
        
        calculateHeatness(h, dt, e, x+i, y-i, z+i);
        
        calculateHeatness(h, dt, e, x-i, y-i, z+i);
        
        calculateHeatness(h, dt, e, x-i, y+i, z-i);
        
        calculateHeatness(h, dt, e, x+i, y+i, z-i);
        
        calculateHeatness(h, dt, e, x+i, y-i, z-i);
        
        calculateHeatness(h, dt, e, x-i, y-i, z-i);
    }
}


function calculateHeatness(h, dt, e, x, y, z) {
    if ((x > 0 && x < global.heatness.length-1) && (y> 0 && y < global.heatness.length-1) && (z> 0 && z < global.heatness.length-1)) {
        
        dx2 = e * ((global.heatness[x+1][y][z] - 2*global.heatness[x][y][z] + global.heatness[x-1][y][z]) / (h*h));
        dy2 = e * ((global.heatness[x][y+1][z] - 2*global.heatness[x][y][z] + global.heatness[x][y-1][z]) / (h*h)); 
        dz2 = e * ((global.heatness[x][y][z+1] - 2*global.heatness[x][y][z] + global.heatness[x][y][z-1]) / (h*h)); 

        var new_color = global.heatness[x][y][z] + dt * dx2 + dt * dy2 + dt * dz2;

        if (x == script.heatnessSource_X && y == script.heatnessSource_Y && z == script.heatnessSource_Z) {                        
            new_color = new_color + script.heatnessValue;
        }
        global.heatness[x][y][z] = new_color;
    }
}