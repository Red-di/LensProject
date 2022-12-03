// -----JS CODE-----
//@input Component.Text MatrixShapeText
//@input Component.Text Heat
//@input Component.Text HeatSourceX
//@input Component.Text HeatSourceY
//@input Component.Text HeatSourceZ

//@input SceneObject MatrixUI
//@input SceneObject MainUI

script.MatrixUI.enabled = false;
script.MainUI.enabled = true;

script.api.addMatrixShape = function() {
    var currentShape = parseInt(script.MatrixShapeText.text);
    if (currentShape < 15)
        script.MatrixShapeText.text = String(currentShape + 1);
}

script.api.removeMatrixShape = function() {
    var currentShape = parseInt(script.MatrixShapeText.text);
    if (currentShape > 1)
        script.MatrixShapeText.text = String(currentShape - 1);
}

script.api.addHeat = function() {
    var currentHeat = parseInt(script.Heat.text);
    if (currentHeat < 10)
        script.Heat.text = String(currentHeat + 1);
}

script.api.removeHeat = function() {
    var currentHeat = parseInt(script.Heat.text);
    if (currentHeat > 1)
        script.Heat.text = String(currentHeat - 1);
}

script.api.addX = function() {
    var currentX = parseInt(script.HeatSourceX.text);
    if (currentX < parseInt(script.MatrixShapeText.text) - 1)
        script.HeatSourceX.text = String(currentX + 1);
}

script.api.removeX = function() {
    var currentX = parseInt(script.HeatSourceX.text);
    if (currentX > 1)
        script.HeatSourceX.text = String(currentX - 1);
}

script.api.addY = function() {
    var currentY = parseInt(script.HeatSourceY.text);
    if (currentY < parseInt(script.MatrixShapeText.text) - 1)
        script.HeatSourceY.text = String(currentY + 1);
}

script.api.removeY = function() {
    var currentY = parseInt(script.HeatSourceY.text);
    if (currentY > 1)
        script.HeatSourceY.text = String(currentY - 1);
}

script.api.addZ = function() {
    var currentZ = parseInt(script.HeatSourceZ.text);
    if (currentZ < parseInt(script.MatrixShapeText.text) - 1)
        script.HeatSourceZ.text = String(currentZ + 1);
}

script.api.removeZ = function() {
    var currentZ = parseInt(script.HeatSourceZ.text);
    if (currentZ > 1)
        script.HeatSourceZ.text = String(currentZ - 1);
}

script.api.cancel = function() {
    script.MatrixShapeText.text = String(global.matrixShape);
    script.Heat.text = String(global.heatnessValue);
    script.HeatSourceX.text = String(global.heatnessSource_X);
    script.HeatSourceY.text = String(global.heatnessSource_Y);
    script.HeatSourceZ.text = String(global.heatnessSource_Z);

    script.MatrixUI.enabled = false;
    script.MainUI.enabled = true;
}

script.api.save = function() {
    global.matrixShape = parseInt(script.MatrixShapeText.text);
    global.heatnessSource_X = parseInt(script.HeatSourceX.text);
    global.heatnessSource_Y = parseInt(script.HeatSourceY.text);
    global.heatnessSource_Z = parseInt(script.HeatSourceZ.text);
    global.heatnessValue = parseInt(script.Heat.text);
    script.MatrixUI.enabled = false;
    script.MainUI.enabled = true;
}