var canvas;
// var colours = ["#bf4040", "#ff8205", "#FFFF00", "#33cc33", "#40bfbf",
//                "#3333cc", "#9f40bf", "#bf8040", "#878788", "#000000"];

var brushes = [
                {"name": "Weather_Warning", "color": "orange"},
                {"name": "Warm_Front", "color": "red"},
                {"name": "Cold_Front", "color": "blue"},
                {"name": "Error", "color": "red"}
              ];

function brushButton (brush) {
    var html = `
    <div id=brush>
        <button id='brush-button' name='${brush.name}' class='glyphicon glyphicon-pencil' style='color: ${brush.color}'; value='${brush.color}'></button>
        <b id='brush-name'>${brush.name}</b>
    </div>
    `;
    return html;
}


$(document).ready (function () {
    // Populate brush selector.
    for(var i=0, size=brushes.length; i < size; i++) {
        var brush = brushes[i];
        console.log(brush)
        // $("#brushpicker").append("<button id='brush-button' name="+brush.name+" class='glyphicon glyphicon-pencil' style='background-color:"+brush.color+"'; value="+brush.color+"></button>");
        $("#brushpicker").append(brushButton(brush))
    }

    init();
});

function init () {
    $("#image").one( "load", setUpImageAndCanvas );
    $("#clear").click( clearCanvas );
    $("#brushpicker").click( brushPick );
    $("#move-mode").click( moveMode );
    $("#delete").click( deleteObjects );
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
        console.log(e.target.name);
        canvas.freeDrawingBrush.color = e.target.value;
        canvas.isDrawingMode = 1;
};

// Toggle drawing mode.
function moveMode () {
    console.log('Move')
    canvas.isDrawingMode = 0;
};

// Clear canvas button.
function clearCanvas () {
    console.log('Clear');
    canvas.clear();
};

// Delete lines
function deleteObjects(){
    console.log("Delete")
    var activeObjects = canvas.getActiveObjects();
    // console.log("deleteObjects")
    if (activeObjects.length > 0) {
        // console.log("activeGroup.length > 0 == true")
        for (object of activeObjects) {
                canvas.remove(object);
                // console.log(object);
        }
    }
}

// Export scribbles as SVG to S3.
function exportSVG () {
    var trsvg = canvas.toSVG();
    console.log('Export_SVG');

    var request = $.ajax({
        url: "https://zpf8m2yw3d.execute-api.eu-west-1.amazonaws.com/dev/upload",
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
