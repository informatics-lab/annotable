var canvas;
var colours = ["#bf4040", "#ff8205", "#FFFF00", "#33cc33", "#40bfbf",
               "#3333cc", "#9f40bf", "#bf8040", "#878788", "#000000"];

$(document).ready (function () {
    // Populate colour selector.
    for(var i=0, size=colours.length; i < size; i++) {
        var colour = colours[i];
        console.log(colour)
        $("#colorpicker").append("<button id='color-button' style='background-color:"+colours[i]+"'; value="+colours[i]+"></button>");
    }

    init();
});

function init () {
    $("#image").one( "load", setUpImageAndCanvas );
    $("#clear").click( clearCanvas );
    $("#colorpicker").click( colourPick );
    $("#drawing-mode").click( toggleDrawingMode );
    $("#drawing-line-width").change( lineWidth );
};

function setUpImageAndCanvas () {
    var img_height = $('#image').height();
    var img_width = $('#image').width();
    setUpCanvas(img_height, img_width);
};

// Set up canvas.
function setUpCanvas (img_height, img_width) {
    canvas = window._canvas = new fabric.Canvas('draw-canvas');
    canvas.backgroundColor = null;
    canvas.setHeight(img_height);
    canvas.setWidth(img_width);
    canvas.calcOffset();
    canvas.isDrawingMode = 1;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;
    canvas.renderAll();
    console.log("Canvas ready: " + img_height + "x" + img_width);
};

// Colour selector.
function colourPick (e) {
        console.log(e.target.value);
        canvas.freeDrawingBrush.color = e.target.value;
};

// Toggle drawing mode.
function toggleDrawingMode () {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        $("#drawing-mode").html('Cancel drawing mode');
        $(".drawing-controls").show();
    }
    else {
        $("#drawing-mode").html('Enter drawing mode');
        $(".drawing-controls").hide();
    }
};

// Clear canvas button.
function clearCanvas () {
    console.log('Clear');
    canvas.clear();
};

// Change line width.
function lineWidth () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    $(".drawing-line-width-info").html(this.value);
    console.log(this.value);
};

// Export scribbles as SVG to S3.
// document.getElementById("export-svg-button").onclick = function() {
//   var trsvg = canvas.toSVG();
//   console.log('save...');
//   console.log(JSON.stringify(trsvg));
//   // var canvas_svg = new fabric.Canvas('canvas-svg');
//   // ('#svg-tag').html(trsvg);
// };
