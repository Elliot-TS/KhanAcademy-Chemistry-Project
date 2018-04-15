
var mousePushed = false;
var mouseTransforms = {
    translation : [0,0],
    scale : [1,1],
    rotation : 0
};
var preMouseTransforms = {
    translation : [0,0],
    scale : [1,1],
    rotation : 0
};
var pushMouseLayers = [];

var pushMouse = function () {
    // Add the mouse position to pushMouseLayers
    pushMouseLayers.push ([mouseX, mouseY]);
    
    // Push mouse translation
    preMouseTransforms.translation[0] = mouseTransforms.translation[0];
    preMouseTransforms.translation[1] = mouseTransforms.translation[1];
    
    // Push mouse scale
    preMouseTransforms.scale[0] = mouseTransforms.scale[0];
    preMouseTransforms.scale[1] = mouseTransforms.scale[1];
    
    // Push mouse rotation
    preMouseTransforms.rotation = mouseTransforms.rotation;
};
var popMouse = function () {
    // Delete the mouse position from pushMouseLayers and set the mouse position to the last layer
    var mpos = pushMouseLayers.pop();
    mouseX = mpos[0];
    mouseY = mpos[1];
    
    // Clear mouse translation
    mouseTransforms.translation[0] = preMouseTransforms.translation[0];
    mouseTransforms.translation[1] = preMouseTransforms.translation[1];
    
    // Clear mouse scale
    mouseTransforms.scale[0] = preMouseTransforms.scale[0];
    mouseTransforms.scale[1] = preMouseTransforms.scale[1];
    
    // Clear mouse rotation
    mouseTransforms.rotation = preMouseTransforms.rotation;
};
var resetMouse = function () {
    // Reset the mouse position
    mouseX = pushMouseLayers[0][0];
    mouseY = pushMouseLayers[0][1];
    pushMouseLayers = [];
    
    // Clear mouse translation
    mouseTransforms.translation[0] = 0;
    mouseTransforms.translation[1] = 0;
    
    // Clear mouse scale
    mouseTransforms.scale[0] = 1;
    mouseTransforms.scale[1] = 1;
    
    // Clear mouse rotation
    mouseTransforms.rotation = 0;
};


// When the preventApply arguments are passed as true, then the mouse's transforms will not apply until applyMouseTransforms() is called.  This can be useful if there are multiple mouse transforms that may be set in different orders but should be applied in a sensible order

var applyMouseTranslation = function () {
    mouseX += mouseTransforms.translation[0];
    mouseY += mouseTransforms.translation[1];
};
var applyMouseScale = function () {
    mouseX *= mouseTransforms.scale[0];
    mouseY *= mouseTransforms.scale[1];
};
var applyMouseRotation = function () {
    var a = mouseTransforms.rotation;
    var mx = mouseX * cos(mouseTransforms.rotation) - mouseY * sin(mouseTransforms.rotation);
    var my = mouseY * cos(mouseTransforms.rotation) + mouseX * sin(mouseTransforms.rotation);
    
    mouseX = mx;
    mouseY = my;
};
var applyMouseTransform = function () {
    // Translate
    applyMouseTranslation ();
    
    // Scale
    applyMouseScale ();
    
    // Rotate
    applyMouseRotation ();
};

var translateMouse = function (x,y, preventApply) {
    // Assign default values to x and y
    x = x || 0; y = y || 0;
    
    // Translate the mouse
    mouseTransforms.translation[0] = x;
    mouseTransforms.translation[1] = y;
    
    // Apply Translation
    if (!preventApply) { applyMouseTranslation (); }
};
var scaleMouse = function (xScale,yScale, preventApply) {
    // Assign a default value to xScale and yScale
    xScale = xScale || 0;  yScale = yScale || xScale;
    
    // Scale the mouse
    mouseTransforms.scale[0] = xScale;
    mouseTransforms.scale[1] = yScale;
    
    if (!preventApply) { applyMouseScale (); }
};
var rotateMouse = function (angle, preventApply) {
    // Assign a default value for angle
    angle = angle || 0;
    
    // Rotate
    mouseTransforms.rotation = angle;
    
    // Apply Rotation
    
    if (!preventApply) { applyMouseRotation (); }
};

var pushMatrix2 = function () {
    pushMatrix ();
    pushMouse ();
};
var popMatrix2 = function () {
    popMouse ();
    popMatrix ();
};

var translate2 = function (x,y) {
    translate (x,y);
    translateMouse (-x,-y);
};
var scale2 = function (x,y, origin) {
    if (origin !== undefined) {
        translate2 (-origin[0], -origin[1]);
    }
    scale (x,y);
    scaleMouse (1/x,1/y);
    if (origin !== undefined) {
        translate2 (origin[0], origin[1]);
    }
};
var rotate2 = function (a, origin) {
    if (origin !== undefined) {
        translate2 (-origin[0],-origin[1]);
    }
    rotate (a);
    rotateMouse (-a);
    if (origin !== undefined) {
        translate2 (origin[0],origin[1]);
    }
};


var pushOriginLayers = [];
var pushOrigin = function (x,y, translateFunc) {
    translateFunc = translateFunc || translate2;
    pushOriginLayers.push ({func:translateFunc,x:x,y:y});
    translateFunc (x,y);
};
var popOrigin = function () {
    var pol = pushOriginLayers[pushOriginLayers.length-1];
    pol.func (-pol.x,-pol.y);
    pushOriginLayers.pop();
};
