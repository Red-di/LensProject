// -----JS CODE-----
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
//@input int heatnessValue
//@input Asset.Material[] materials

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
    matrix[i] = new Array(script.MatrixShape);
}

var heatness = [];
for(var i=0; i < script.MatrixShape; i++) {
    heatness[i] = [];
    for(var j=0; j < script.MatrixShape; j++) {
        heatness[i][j] = 0;
    }
}

// var camera_coords = script.camera.getTransform().getWorldPosition();
// createMatrix(camera_coords.x, camera_coords.y, camera_coords.z, script.MatrixShape);

// heatness[script.heatnessSource_X][script.heatnessSource_Y] = script.heatnessValue;
// var heatnessSource = [script.heatnessSource_X, script.heatnessSource_Y];
// var renderMeshVisual = matrix[script.heatnessSource_X][script.heatnessSource_Y].getComponent("Component.RenderMeshVisual");

// renderMeshVisual.clearMaterials();
// renderMeshVisual.addMaterial(script.materials[10]);

var centerOfScreenPos = new vec2(0.5,0.5);
var worldTrackingProvider = script.worldMesh.mesh.control;
worldTrackingProvider.meshClassificationFormat = MeshClassificationFormat.PerVertexFast;
worldTrackingProvider.useNormals = true;
worldTrackingProvider.enableDepthModelBasedTracking = true;

var hit = script.device.hitTestWorldMesh(centerOfScreenPos);
hit.forEach(function (hit) {
   if (hit.classification == 1) {
       createMatrix(hit.position.x, hit.position.y, hit.position.z, script.MatrixShape);
       
       heatness[script.heatnessSource_X][script.heatnessSource_Y] = script.heatnessValue;
       var heatnessSource = [script.heatnessSource_X, script.heatnessSource_Y];
       var renderMeshVisual = matrix[script.heatnessSource_X][script.heatnessSource_Y].getComponent("Component.RenderMeshVisual");
       
       renderMeshVisual.clearMaterials();
       renderMeshVisual.addMaterial(script.materials[10]);
   }
   else
       global.logToScreen("Please hit wall");
});



for (var t = 0; t < script.time; t++){
    spreadHeatness(script.h, script.dt, script.e, [script.heatnessSource_X, script.heatnessSource_Y]);
}

function addNewObject(x, y, z) {
    var newSceneObject = global.scene.createSceneObject("Object");
    newSceneObject.getTransform().setWorldPosition(new vec3(x, y, z));
    newSceneObject.getTransform().setWorldScale(new vec3(0.05, 0.05, 0.05));

    var newRot = quat.quatIdentity();
    newRot.w = Math.cos((45/2)*Math.PI/180)
    newRot.y = Math.sin((45/2)*Math.PI/180)
    newSceneObject.getTransform().setLocalRotation(newRot);
    
    var meshComp = newSceneObject.createComponent("Component.RenderMeshVisual");
    meshComp.addMaterial(script.materials[0]);
    meshComp.mesh = script.box.getComponent("Component.RenderMeshVisual").mesh;
    return newSceneObject;
}

function createMatrix(startX, startY, startZ, shape) {  
    var phoneRotation = script.device.getTransform().getLocalRotation();
    var halfShape = Math.floor(shape/2);
    for(i = -halfShape; i < halfShape+1; i++) {
        for(j = -halfShape; j < halfShape+1; j++) {
            if ((phoneRotation.y > 0.3 && phoneRotation.y < 0.9) || phoneRotation.w < 0)
                matrix[i+halfShape][j+halfShape] = addNewObject(startX+j, startY+i, startZ-Math.sqrt((j+halfShape)*(j+halfShape)));   
            else
                matrix[i+halfShape][j+halfShape] = addNewObject(startX+j, startY+i, startZ+Math.sqrt((j+halfShape)*(j+halfShape)));   

        }  
    } 
}


function spreadHeatness(h, dt, e, heatnessSource) {
    var x = heatnessSource[0];
    var y = heatnessSource[1];
    for (var i = 1; i < heatness.length; i++) {
        
        // Point N
        calculateHeatness(h, dt, e, x-i, y);
        
        // Point E
        calculateHeatness(h, dt, e, x, y+i);
        
        // Point S
        calculateHeatness(h, dt, e, x+i, y);
        
        // Point W
        calculateHeatness(h, dt, e, x, y-i);

        for (var j = 1; j < i; j++) {
            
            calculateHeatness(h, dt, e, x-i, y-j);
            calculateHeatness(h, dt, e, x-i, y+j);

            calculateHeatness(h, dt, e, x-j, y+i);
            calculateHeatness(h, dt, e, x+j, y+i);
        
            calculateHeatness(h, dt, e, x+i, y-j);
            calculateHeatness(h, dt, e, x+i, y+j);

            calculateHeatness(h, dt, e, x-j, y-i);
            calculateHeatness(h, dt, e, x+j, y-i);
        }

         // Point NE
         calculateHeatness(h, dt, e, x-i, y+i);
        
         // Point SE
         calculateHeatness(h, dt, e, x+i, y+i);

         // Point SW
         calculateHeatness(h, dt, e, x+i, y-i);

         // Point NW      
         calculateHeatness(h, dt, e, x-i, y-i);

    }
}


function calculateHeatness(h, dt, e, x, y) {
    if ((x > 0 && x < heatness.length-1) && (y> 0 && y < heatness.length-1)) {
        var neighbourN = heatness[x][y+1];
        var neighbourS = heatness[x][y-1];
        var neighbourE = heatness[x+1][y];
        var neighbourW = heatness[x-1][y];
        
        dx2 = e * ((neighbourE - 2*heatness[x][y] + neighbourW) / (h*h));
        dy2 = e * ((neighbourN - 2*heatness[x][y] + neighbourS) / (h*h));        
        new_color = heatness[x][y] + dt * dx2 + dt * dy2;
        
        var previous_color = heatness[x][y];
        heatness[x][y] = new_color;
        
        if (previous_color.toFixed(1) != heatness[x][y].toFixed(1)) {
            var renderMeshVisual = matrix[x][y].getComponent("Component.RenderMeshVisual");
            renderMeshVisual.clearMaterials();
            if (new_color.toFixed(1) > 1.0) {
                renderMeshVisual.addMaterial(materialsDict["1.0"]);
            } else {
                renderMeshVisual.addMaterial(materialsDict[new_color.toFixed(1)]);
            }
        }
    }
}