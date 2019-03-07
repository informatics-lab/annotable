var canvas;

var brushes = [
                {"name": "Warm_Front", "color": "red"},
                {"name": "Cold_Front", "color": "blue"},
                {"name": "Occluded_Front", "color": "purple"},
                {"name": "Weather_Warning", "color": "orange"},
                {"name": "Error", "color": "grey"}
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
    init();

    // Populate brush selector.
    for(var i=0, size=brushes.length; i < size; i++) {
        var brush = brushes[i];
        console.log(brush)
        $("#brushpicker").append(brushButton(brush))
    }


});

// function isImageDoneAlreadyOrWhat () {
//
// }

function init () {
    // $("#image").one( "load", setUpImageAndCanvas );
    if (document.getElementById('image').complete){
        setUpImageAndCanvas()
    } else {
        $("#image").one( "load", setUpImageAndCanvas );
    }
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
    console.log("Canvas ready: " + img_height + " x " + img_width + " px");
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
        // headers: {'Access-Control-Allow-Origin': true},
        // headers: {},
        // data: { "user_file" : trsvg },
        data: trsvg
        // dataType: "text"
        // mime_type: 'img/svg'
    }).done(function( msg ) {
        console.log( msg );
    }).fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });
};
