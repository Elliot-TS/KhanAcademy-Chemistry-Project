/** This work, "KA P.JS", is a derivative of "http://stackoverflow.com/questions/25341597/how-can-khan-academy-computer-programs-be-run-offline-or-on-my-own-website " by Robert Tupelo-Schneck(http://stackoverflow.com/users/394431/robert-tupelo-schneck), used under CC BY. "KA P.JS" is by michael basaj(https://www.khanacademy.org/profile/michaelbasaj/) **/
var canvas = document.getElementById("canvas");
var processing = new Processing(canvas, function(processing) {
    processing.size(400, 400);
    processing.background(0xFFF);

    var mouseIsPressed = false;
    processing.mousePressed = function () { mouseIsPressed = true; };
    processing.mouseReleased = function () { mouseIsPressed = false; };

    var keyIsPressed = false;
    processing.keyPressed = function () { keyIsPressed = true; };
    processing.keyReleased = function () { keyIsPressed = false; };

    function getImage(s) {
        var url = "https://www.kasandbox.org/programming-images/" + s + ".png";
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    // use degrees rather than radians in rotate function
    var rotateFn = processing.rotate;
    processing.rotate = function (angle) {
        rotateFn(processing.radians(angle));
    };
    
    if (typeof draw !== 'undefined') processing.draw = draw;
});
