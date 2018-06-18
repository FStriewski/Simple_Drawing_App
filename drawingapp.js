 // Globals:
let colorPurple = "#cb3594";
let colorGreen = "#659b41";
let colorYellow = "#ffcf33";
let colorBrown = "#986928";

let curColor = colorPurple;
let clickColor = new Array();
 
 
 drawCanvas = () => {

    let canvasDiv = document.getElementById('canvasDiv')

    let canvas = document.createElement('canvas')
    canvas.setAttribute('width', 750)
    canvas.setAttribute('height', 400)
    canvas.setAttribute('id', 'canvas')

    canvasDiv.appendChild(canvas);
    (typeof G_vmlCanvasManager != 'undefined') 
        ? canvas = G_vmlCanvasManager.initElement(canvas)
        : null 

    context = canvas.getContext("2d");

    let clickX = new Array();
    let clickY = new Array();
    let clickDrag = new Array();
    let paint;

    // Add Click pushes position into array
     addClick = (x, y, dragging) => {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickColor.push(curColor);
    }

    // Redraw action:
     redraw = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        // context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 3;

        for (let i = 0; i < clickX.length; i++) {
            context.beginPath();

            (clickDrag[i] && i) 
                ? context.moveTo(clickX[i - 1], clickY[i - 1])
                : context.moveTo(clickX[i] - 1, clickY[i])
            
            context.lineTo(clickX[i], clickY[i])
            context.closePath()
            context.strokeStyle = clickColor[i];
            context.stroke()
        }
    }


    // Draw action start or point (mouse down):
    $('#canvas').mousedown(function (e) {
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });
    // Mouse move
    $('#canvas').mousemove(function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });
    // Mouse up (stop drawing)
    $('#canvas').mouseup(function (e) {
        paint = false
    });

    // Leave event for drawing over the border:
    $('#canvas').mouseleave(function (e) {
        paint = false
    });

     $('#clear').mouseup(function () {
         context.clearRect(0, 0, context.canvas.width, context.canvas.height)
     }) //
     //clear = () => {context.clearRect(0, 0, context.canvas.width, context.canvas.height)}
}

