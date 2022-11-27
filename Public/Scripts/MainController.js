// -----JS CODE-----
//@input Component.ScriptComponent multiplayerSession
//@input SceneObject uiPanel

script.uiPanel.enabled = false;

script.multiplayerSession.onStarterConnectedToSolo = function (session) {
    // Request to invite others either via friends list or Snapcode
    script.uiPanel.enabled = true;        
    script.multiplayerSession.shareSession(); 
}

script.multiplayerSession.onStarterConnectedToMultiplayer = function (_session) {
    script.uiPanel.enabled = true;        
    session = _session;
}

script.multiplayerSession.onReceiverConnectedToMultiplayer = function (_session) {
    script.uiPanel.enabled = true;        
    session = _session;
}

// Starting 3D visualization
script.api.spawn = function() {
    if (global.spawn) {
        deleteMatrix();
    }
    global.startInAir();
}

script.api.startAnimation = function() {
    if (global.spawn)
    {
        global.startTween();
    }
}

script.api.remove = function() {
    deleteMatrix()
}

function deleteMatrix() {
    global.spawn = false;
    for(var i = 0; i < global.matrix.length; i++) {
        for (var j = 0; j < global.matrix.length; j++) {
            for (var k = 0; k < global.matrix.length; k++) {
                 if (!isNull(global.matrix[i][j][k])) {
                    global.matrix[i][j][k].destroy();
                }
            }
        }
    }
    for(var i = 0; i < global.heatness.length; i++) {
        for (var j = 0; j < global.heatness.length; j++) {
            for (var k = 0; k < global.heatness.length; k++) {
                 global.heatness[i][j][k] = 0;
            }
        }
    }
}