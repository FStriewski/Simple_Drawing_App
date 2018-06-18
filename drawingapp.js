 // Globals:

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let paint;
let canvasWidth = 750;
let canvasHeight = 400;
 
// Color vars:

var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";

var curColor = colorPurple;
var clickColor = new Array();
 

 drawCanvas = () => {

    const canvasDiv = document.getElementById('canvasDiv')

    const canvas = document.createElement('canvas')
        canvas.setAttribute('width', canvasWidth)
        canvas.setAttribute('height', canvasHeight)
        canvas.setAttribute('id', 'canvas')

    canvasDiv.appendChild(canvas);
    
    (typeof G_vmlCanvasManager != 'undefined') 
        ? canvas = G_vmlCanvasManager.initElement(canvas)
        : null

    const context = canvas.getContext("2d");

    // Add Click pushes position into array
     addClick = (x, y, dragging, curColor) => {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickColor.push(curColor);
    }

    // Redraw action:
    redraw = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 3;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();

             (clickDrag[i] && i) 
                ?  context.moveTo(clickX[i - 1], clickY[i - 1])
                : context.moveTo(clickX[i] - 1, clickY[i])
            
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }


    // Draw action start or point (mouse down):
     $('#canvas').mousedown(e => {
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });
    // Mouse move
    $('#canvas').mousemove( e => {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });
    // Mouse up (stop drawing)
     $('#canvas').mouseup(e => {
        paint = false;
    });

    // Leave event for drawing over the border:
     $('#canvas').mouseleave(e => {
        paint = false;
    });
}