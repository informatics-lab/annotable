var canvas;
// var colours = ["#bf4040", "#ff8205", "#FFFF00", "#33cc33", "#40bfbf",
//                "#3333cc", "#9f40bf", "#bf8040", "#878788", "#000000"];

var brushes = [
                {"name": "Weather_Warning", "color": "orange"},
                {"name": "Warm_Front", "color": "red"},
                {"name": "Cold_Front", "color": "blue"},
                {"name": "Error", "color": "red"}
              ];

$(document).ready (function () {
    // Populate brush selector.
    for(var i=0, size=brushes.length; i < size; i++) {
        var brush = brushes[i];
        console.log(brush)
        $("#brushpicker").append("<button id='brush-button' style='background-color:"+brush.color+"'; value="+brush.color+"></button>");
    }

    init();
});

function init () {
    $("#image").one( "load", setUpImageAndCanvas );
    $("#clear").click( clearCanvas );
    $("#brushpicker").click( brushPick );
    $("#drawing-mode").click( toggleDrawingMode );
    // $("#drawing-line-width").change( lineWidth );
    $("#export-svg-button").click ( exportSVG );
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
    canvas.freeDrawingBrush.color = "red";
    canvas.freeDrawingBrush.width = 5;
    canvas.renderAll();
    console.log("Canvas ready: " + img_height + "x" + img_width);
};

// Brush selector.
function brushPick (e) {
        console.log(e.target.id);
        canvas.freeDrawingBrush.color = e.target.value;
        canvas.isDrawingMode = 1;
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

// Export scribbles as SVG to S3.
function exportSVG () {
    var trsvg = canvas.toSVG();
    console.log('save...');

    var request = $.ajax({
        url: "https://ngj8pqd220.execute-api.eu-west-1.amazonaws.com/dev",
        method: "POST",
        headers: {'Access-Control-Allow-Origin': true},
        data: { "user_file" : trsvg },
        dataType: "text"
    }).done(function( msg ) {
        console.log( msg );
    }).fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });
};
