// -----JS CODE-----
//@input Component.Text MatrixShapeText
//@input Component.Text Heat
//@input Component.Text HeatSourceX
//@input Component.Text HeatSourceY
//@input Component.Text HeatSourceZ
//@input Component.Text AnimationTime

//@input SceneObject MatrixUI
//@input SceneObject MainUI

//@input SceneObject addMatrixShape
//@input SceneObject removeMatrixShape
//@input SceneObject addHeat
//@input SceneObject removeHeat
//@input SceneObject addX
//@input SceneObject removeX
//@input SceneObject addY
//@input SceneObject removeY
//@input SceneObject addZ
//@input SceneObject removeZ
//@input SceneObject addTime
//@input SceneObject removeTime

script.MatrixUI.enabled = false;
script.MainUI.enabled = true;

script.api.addMatrixShape = function() {
    var currentShape = parseInt(script.MatrixShapeText.text);
    if (currentShape < 15)
        script.MatrixShapeText.text = String(currentShape + 1);
    if (script.MatrixShapeText.text == "15")
        script.addMatrixShape.enabled = false;
    else if (script.MatrixShapeText.text != "3" && script.removeMatrixShape.enabled == false)
        script.removeMatrixShape.enabled = true;

    if (script.addX.enabled == false) 
        script.addX.enabled = true;
    if (script.addY.enabled == false) 
        script.addY.enabled = true;
    if (script.addZ.enabled == false) 
        script.addZ.enabled = true;
}

script.api.removeMatrixShape = function() {
    var currentShape = parseInt(script.MatrixShapeText.text);
    if (currentShape > 3)
        script.MatrixShapeText.text = String(currentShape - 1);
    if (script.MatrixShapeText.text == "3")
        script.removeMatrixShape.enabled = false;
    else if (script.MatrixShapeText.text != "15" && script.addMatrixShape.enabled == false)
        script.addMatrixShape.enabled = true;

    if (script.addX.enabled == false) 
        script.api.removeX();
    if (script.addY.enabled == false) 
        script.api.removeY();
    if (script.addZ.enabled == false)
        script.api.removeZ();

    currentShape = parseInt(script.MatrixShapeText.text);
    if (script.HeatSourceX.text == String(currentShape - 2))
        script.addX.enabled = false;
    if (script.HeatSourceY.text == String(currentShape - 2))
        script.addY.enabled = false;
    if (script.HeatSourceZ.text == String(currentShape - 2))
        script.addZ.enabled = false;
}

script.api.addHeat = function() {
    var currentHeat = parseInt(script.Heat.text);
    if (currentHeat < 10)
        script.Heat.text = String(currentHeat + 1);
    if (script.Heat.text == "10")
        script.addHeat.enabled = false;
    else if (script.Heat.text != "1" && script.removeHeat.enabled == false)
        script.removeHeat.enabled = true;
}

script.api.removeHeat = function() {
    var currentHeat = parseInt(script.Heat.text);
    if (currentHeat > 1)
        script.Heat.text = String(currentHeat - 1);
    if (script.Heat.text == "1")
        script.removeHeat.enabled = false;
    else if (script.Heat.text != "10" && script.addHeat.enabled == false)
        script.addHeat.enabled = true;
}

script.api.addTime = function() {
    var currentTime = parseInt(script.AnimationTime.text);
    if (currentTime < parseInt(60))
        script.AnimationTime.text = String(currentTime + 1);
    if (script.AnimationTime.text == "60")
        script.addTime.enabled = false;
    else if (script.AnimationTime.text != "1" && script.removeTime.enabled == false)
        script.removeTime.enabled = true;
}

script.api.removeTime = function() {
    var currentTime = parseInt(script.AnimationTime.text);
    if (currentTime > 1)
        script.AnimationTime.text = String(currentTime - 1);
    if (script.AnimationTime.text == "1")
        script.removeTime.enabled = false;
    else if (script.AnimationTime.text != "60" && script.addTime.enabled == false)
        script.addTime.enabled = true;
}


script.api.addX = function() {
    var currentX = parseInt(script.HeatSourceX.text);
    if (currentX < parseInt(script.MatrixShapeText.text) - 2)
        script.HeatSourceX.text = String(currentX + 1);
    if (script.HeatSourceX.text == String(parseInt(script.MatrixShapeText.text)) - 2)
        script.addX.enabled = false;
    else if (script.HeatSourceX.text != "1" && script.removeX.enabled == false)
        script.removeX.enabled = true;
}

script.api.removeX = function() {
    var currentX = parseInt(script.HeatSourceX.text);
    if (currentX > 1)
        script.HeatSourceX.text = String(currentX - 1);
    if (script.HeatSourceX.text == "1")
        script.removeX.enabled = false;
    else if (script.HeatSourceX.text != String(parseInt(script.MatrixShapeText.text)) - 2 && script.addX.enabled == false)
        script.addX.enabled = true;
}

script.api.addY = function() {
    var currentY = parseInt(script.HeatSourceY.text);
    if (currentY < parseInt(script.MatrixShapeText.text) - 2)
        script.HeatSourceY.text = String(currentY + 1);
    if (script.HeatSourceY.text == String(parseInt(script.MatrixShapeText.text)) - 2)
        script.addY.enabled = false;
    else if (script.HeatSourceY.text != "1" && script.removeY.enabled == false)
        script.removeY.enabled = true;
}

script.api.removeY = function() {
    var currentY = parseInt(script.HeatSourceY.text);
    if (currentY > 1)
        script.HeatSourceY.text = String(currentY - 1);
    if (script.HeatSourceY.text == "1")
        script.removeY.enabled = false;
    else if (script.HeatSourceY.text != String(parseInt(script.MatrixShapeText.text)) - 2 && script.addY.enabled == false)
        script.addY.enabled = true;
}

script.api.addZ = function() {
    var currentZ = parseInt(script.HeatSourceZ.text);
    if (currentZ < parseInt(script.MatrixShapeText.text) - 2)
        script.HeatSourceZ.text = String(currentZ + 1);
    if (script.HeatSourceZ.text == String(parseInt(script.MatrixShapeText.text)) - 2)
        script.addZ.enabled = false;
    else if (script.HeatSourceZ.text != "1" && script.removeZ.enabled == false)
        script.removeZ.enabled = true;
}

script.api.removeZ = function() {
    var currentZ = parseInt(script.HeatSourceZ.text);
    if (currentZ > 1)
        script.HeatSourceZ.text = String(currentZ - 1);
    if (script.HeatSourceZ.text == "1")
        script.removeZ.enabled = false;
    else if (script.HeatSourceZ.text != String(parseInt(script.MatrixShapeText.text)) - 2 && script.addZ.enabled == false)
        script.addZ.enabled = true;
}

script.api.cancel = function() {
    script.MatrixShapeText.text = String(global.matrixShape);
    script.Heat.text = String(global.heatnessValue);
    script.HeatSourceX.text = String(global.heatnessSource_X);
    script.HeatSourceY.text = String(global.heatnessSource_Y);
    script.HeatSourceZ.text = String(global.heatnessSource_Z);
    script.AnimationTime.text = String(global.animationTime);
    script.MatrixUI.enabled = false;
    script.MainUI.enabled = true;
}

script.api.save = function() {
    global.matrixShape = parseInt(script.MatrixShapeText.text);
    global.heatnessSource_X = parseInt(script.HeatSourceX.text);
    global.heatnessSource_Y = parseInt(script.HeatSourceY.text);
    global.heatnessSource_Z = parseInt(script.HeatSourceZ.text);
    global.heatnessValue = parseInt(script.Heat.text);
    global.animationTime = parseInt(script.AnimationTime.text)
    script.MatrixUI.enabled = false;
    script.MainUI.enabled = true;
}