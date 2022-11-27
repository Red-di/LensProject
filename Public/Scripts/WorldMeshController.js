/**
// Name: WorldMeshController.js
// Version: 0.0.1
// Description: Provides the ability to understand surfaces in the real world at a specific point, 
// or, when world mesh is not available, defines a virtual surface. 
*/

//@input Component.DeviceTracking tracker
//@input Component.RenderMeshVisual worldMesh

global.WorldMeshController = {
    numberOfTypes: 8,
    surfaceType: {
        None: 0,
        Wall: 1,
        Floor: 2,
        Ceiling: 3,
        Table: 4,
        Seat: 5,
        Window: 6,
        Door: 7
    }
};


function initialize() {
    if (validateInputs()) {
        worldMeshHit();
        global.WorldMeshController.isInitialize = true;
    }
}

function validateInputs() {
    if (!script.tracker) {
        print("ERROR: Make sure to set the Device Tracking Component to the script.");
        global.WorldMeshController.isInitialize = false;
        return false;
    }
    if (!script.worldMesh) {
        print("ERROR: Make sure to set the World Mesh to the script.");
        global.WorldMeshController.isInitialize = false;
        return false;
    }

    return true;
}

function isWorldMeshCapable() {
    var os = global.deviceInfoSystem.getOS();
    var isMobile = os === OS.iOS || os === OS.Android;
    var isInteractivePreview = global.deviceInfoSystem.isEditor() && script.tracker.worldTrackingCapabilities.sceneReconstructionSupported;
   
    return isInteractivePreview 
        || (isMobile && script.tracker.isDeviceTrackingModeSupported(DeviceTrackingMode.World));
}

var HitTestResult = function(isValid, res) {
    this._isValid = isValid;
    this._res = res;

    this.isValid = function() {
        return this._isValid;
    };

    this.getWorldPos = function() {
        return this._res.position;
    };

    this.getClassification = function() {
        return this._res.classification;
    };
};


function worldMeshHit() {
    
    if (!isWorldMeshCapable()) {
        script.tracker.requestDeviceTrackingMode(DeviceTrackingMode.Surface);

        global.WorldMeshController.getHitTestResult3D = function() {
            return {
                isValid: function() {
                    return true;
                },
                getWorldPos: function() {
                    return new vec3(0, 100, -200);
                },
                getClassification: function() {
                    return 0;
                }
            };
        };

    } else {
        var worldTrackingProvider = script.worldMesh.mesh.control;
        worldTrackingProvider.meshClassificationFormat = MeshClassificationFormat.PerVertexFast;
        worldTrackingProvider.enableDepthModelBasedTracking = true;


        global.WorldMeshController.getHitTestResult = function(screenPos) {
            var resultIsValid = false;
            var res = {};

            if (script.tracker.hitTestWorldMesh != null) {
                var resArray = script.tracker.hitTestWorldMesh(screenPos);

                if (resArray.length) {
                    res = resArray[0];
                    resultIsValid = true;
                }
            }

            return new HitTestResult(resultIsValid, res);
        };

        global.WorldMeshController.getHitTestResult3D = function(from, to) {
            var resultIsValid = false;
            var res = {};
            if (script.tracker.raycastWorldMesh != null) {
                var resArray = script.tracker.raycastWorldMesh(from, to);
                if (resArray.length) {
                    res = resArray[0];
                    resultIsValid = true;
                }
            }
            return new HitTestResult(resultIsValid, res);
        };
    }
}

initialize();