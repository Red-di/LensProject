// -----JS CODE-----

global.animationTime = 10;
global.tween = null;
global.setupTween = null

global.startTween = function() {
    if (global.setupTween) {
        if (global.tween.length > 0) {
            // Start the tweens
            for (var i = 0; i < global.tween.length; i++) {
                global.tween[i].start();
            }
        }
    }
}

// On update, update the Tween engine
function onUpdateEvent() {
    TWEEN.update();
}

// Bind an update event
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent);

// Create the tween with passed in parameters
global.setupTween = function() {

    global.tween = [];

    for(var i = 0; i < global.matrix.length; i++) {
        for (var j = 0; j < global.matrix.length; j++) {
            for (var k = 0; k < global.matrix.length; k++) {
                if (global.heatness[i][j][k].toFixed(2) != 0) {
                    setupColorComponentTweens("Component.MaterialMeshVisual", global.matrix[i][j][k], i, j, k);
                } else {
                    global.matrix[i][j][k].destroy();
                }
            }
        }
    }

    if (global.tween.length == 0) {
        print("Tween Color:  No compatible components found for SceneObject " + script.sceneObject.name);
    }
    return global.tween;
}

// Create Tweens for specific Visual Component (e.g. MaterialMeshVisual or Text)
function setupColorComponentTweens(componentType, sceneObject, x, y, z) {
    var visualComponents = sceneObject.getComponents(componentType);
    for (var i = 0; i < visualComponents.length; i++) {
        var visualComponent = visualComponents[i];
        if (visualComponent.getMaterialsCount() == 0) {
            continue;
        }

        var startValue = null;

        var endValue = null;

        var tween = null;

        if (x == global.heatnessSource_X && y == global.heatnessSource_Y && z == global.heatnessSource_Z) {
            startValue = {
                r: 255,
                g: 0,
                b: 0,
                a: 0,
            }    
        } else {
            startValue = {
                r: 0,
                g: 0,
                b: 255,
                a: 0
            }
        }
            
        endValue = {
            r: (255 * global.heatness[x][y][z]).toFixed(0),
            g: 0,
            b: (255 * (1 - global.heatness[x][y][z])).toFixed(0),
            a: global.heatness[x][y][z]
        }

        
        // Create the tween
        tween = new TWEEN.Tween(startValue)
            .to(endValue, global.animationTime * 1000.0)
            .easing(TWEEN.Easing.Linear.None)
            .delay(0)
            .onUpdate(updateColorComponent(visualComponent));

        if (tween) {
            // Configure the type of looping based on the inputted parameters

            global.tween.push(tween);
        } else {
            print("Tween Color: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\".");
        } 
    }
}

function updateVisual(visualComponent, value) {
    visualComponent.getMaterial(0).getPass(0).baseColor = new vec4(value.r/255, value.g/255, value.b/255, value.a);
}

function updateColorComponent(visualComponent) {
    return function(value) {
        updateVisual(visualComponent, value);
    }
}


