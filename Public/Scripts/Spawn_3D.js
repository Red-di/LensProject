// -----JS CODE-----
//@input SceneObject box
//@input Component.Camera camera
//@input Component.DeviceTracking device
// @input Component.RenderMeshVisual worldMesh
//@input int MatrixShape
//@input float h
//@input float dt
//@input float e
//@input float time
//@input int heatnessSource_X
//@input int heatnessSource_Y
//@input int heatnessSource_Z
//@input int heatnessValue
//@input Asset.Material[] materials
var count = 0;
var materialsDict = {
    "0.0": script.materials[0],
    "0.1": script.materials[1],
    "0.2": script.materials[2],
    "0.3": script.materials[3],
    "0.4": script.materials[4],
    "0.5": script.materials[5],
    "0.6": script.materials[6],
    "0.7": script.materials[7],
    "0.8": script.materials[8],
    "0.9": script.materials[9],
    "1.0": script.materials[10],
}

var matrix = [];
for(var i=0; i < script.MatrixShape; i++) {
    matrix[i] = [];
    for(var j=0; j < script.MatrixShape; j++)
        matrix[i][j] = new Array(script.MatrixShape);
}

var heatness = [];
for(var i=0; i < script.MatrixShape; i++) {
    heatness[i] = [];
    for(var j=0; j < script.MatrixShape; j++) {
        heatness[i][j] = [];
        for(var k=0; k < script.MatrixShape; k++) {
            heatness[i][j][k] = 0;
        }
    }
}

var camera_coords = script.camera.getTransform().getWorldPosition();
createMatrix(camera_coords.x, camera_coords.y, camera_coords.z, script.MatrixShape);

heatness[script.heatnessSource_X][script.heatnessSource_Y][script.heatnessSource_Z] = script.heatnessValue;
var heatnessSource = [script.heatnessSource_X, script.heatnessSource_Y, script.heatnessSource_Z];
var renderMeshVisual = matrix[script.heatnessSource_X][script.heatnessSource_Y][script.heatnessSource_Z].getComponent("Component.RenderMeshVisual");

renderMeshVisual.clearMaterials();
renderMeshVisual.addMaterial(script.materials[10]);


for (var t = 0; t < script.time; t++){
    spreadHeatness(script.h, script.dt, script.e, [script.heatnessSource_X, script.heatnessSource_Y, script.heatnessSource_Z]);
}

function addNewObject(x, y, z) {
    var newSceneObject = global.scene.createSceneObject("Object");
    newSceneObject.getTransform().setWorldPosition(new vec3(x, y, z));
    newSceneObject.getTransform().setWorldScale(new vec3(0.05, 0.05, 0.05));
    
    var meshComp = newSceneObject.createComponent("Component.RenderMeshVisual");
    meshComp.addMaterial(script.materials[0]);
    meshComp.mesh = script.box.getComponent("Component.RenderMeshVisual").mesh;
    return newSceneObject;
}

function createMatrix(startX, startY, startZ, shape) {  
    var halfShape = Math.floor(shape/2);
    for(i = -halfShape; i < halfShape+1; i++) {
        for(j = -halfShape; j < halfShape+1; j++) {
            for(k = -halfShape; k < halfShape+1; k++) { 
                matrix[i+halfShape][j+halfShape][k+halfShape] = addNewObject(startX+i, startY+j, startZ+k);   
            }
        }  
    } 
}

function spreadHeatness(h, dt, e, centre) {
    var x = centre[0];
    var y = centre[1];
    var z = centre[2];
    
    calculateHeatness(h, dt, e, x, y, z);
    
    for (var i = 1; i < matrix.length/2-1; i++) {
        
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
    if ((x > 0 && x < heatness.length-1) && (y> 0 && y < heatness.length-1) && (z> 0 && z < heatness.length-1)) {
        
        dx2 = e * ((heatness[x+1][y][z] - 2*heatness[x][y][z] + heatness[x-1][y][z]) / (h*h));
        dy2 = e * ((heatness[x][y+1][z] - 2*heatness[x][y][z] + heatness[x][y-1][z]) / (h*h)); 
        dz2 = e * ((heatness[x][y][z+1] - 2*heatness[x][y][z] + heatness[x][y][z-1]) / (h*h)); 

        var new_color = heatness[x][y][z] + dt * dx2 + dt * dy2 + dt * dz2;

        if (x == script.heatnessSource_X && y == script.heatnessSource_Y && z == script.heatnessSource_Z) {                        
            new_color = new_color + script.heatnessValue;
        }

        var previous_color = heatness[x][y][z];
        heatness[x][y][z] = new_color;

        if (previous_color.toFixed(1) != heatness[x][y][z].toFixed(1)) {
            var renderMeshVisual = matrix[x][y][z].getComponent("Component.RenderMeshVisual");
            renderMeshVisual.mainPass.blendMode = 0;
            if (new_color.toFixed(1) > 1.0) {
                renderMeshVisual.addMaterial(materialsDict["1.0"]);
            } else {
                renderMeshVisual.addMaterial(materialsDict[new_color.toFixed(1)]);
            }
        }
    }
}