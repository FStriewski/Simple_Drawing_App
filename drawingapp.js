// Globals:

let mode = {
    add: "add",
    select: "select",
    drag: "drag",
}

let sizes = {
    small: 2,
    normal: 5,
    large: 7,
    huge: 10,
}

let tools = {
    pen: "pen",
    eraser: "eraser",
    crayon: "crayon",
    path: "path",
}

let curTool = tools.pen
let curSize = sizes.normal
let curColor = "#e66465"


// Helper:

switchTool = (select) => {
    curTool = tools[select]
}

switchColor = () => {
    let select = document.getElementById("colorPicker").value
    curColor = select
}

sliderChange = () => {
    let select = document.getElementById("sizeSlider").value
    curSize = select
}

switchMode = (x) => {
console.log(x)
}

// Main:

drawCanvas = () => {

    const canvas = $('#canvas')
    const context = canvas.get(0).getContext("2d");

    let clickX = new Array(); // Array of Number
    let clickY = new Array(); // Array of Number
    let clickDrag = new Array(); // Array of Bool
    let clickColor = new Array();
    let clickSize = new Array();
    let clickTool = new Array();
    let paint;

    // Fills arrays with information
    addClick = (x, y, dragging) => {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);

        if (curTool == tools.eraser) {
            clickColor.push("white");
            clickSize.push(curSize * 2.5);
            document.getElementById("canvas").style.cursor = "all-scroll";

            if (curTool == tools.path) {
            }

        } else {
            clickColor.push(curColor);
            clickSize.push(curSize);
            document.getElementById("canvas").style.cursor = "cell";
        }
    }

    clearCanvas = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    setPath = () => {
       // context.lineJoin = "round";
       
       for (let i = 0; i < clickX.length; i++) {
           context.beginPath()
           context.lineWidth = 3;
           context.strokeStyle = 1
           context.lineWidth = 2
          //  context.moveTo(clickX[i - 1], clickY[i - 1])

         // context.moveTo(clickX[i], clickY[i])
          context.moveTo(clickX[i-1], clickY[i-1])
          context.lineTo(clickX[i], clickY[i])
          
          context.stroke()
        }
        context.closePath()


    }

    // Redraw action:
    redraw = () => {
        clearCanvas();

        context.lineJoin = "round";
        context.lineWidth = 3;

        for (let i = 0; i < clickX.length; i++) {
            context.beginPath();

            (clickDrag[i] && i) // dot or line? Determined by drag t/f
            ?   context.moveTo(clickX[i - 1], clickY[i - 1])
            :   context.moveTo(clickX[i]-1, clickY[i]) // Set starting point
            context.lineTo(clickX[i], clickY[i])
            context.closePath()

            context.strokeStyle = clickColor[i]
            context.lineWidth = clickSize[i]
            context.stroke()
        }
    }

    // Draw action start or point (mouse down):
    $('#canvas').mousedown(function (e) {
        paint = true;

        let wrapper = 16
        let top = document.getElementById("navbar").offsetHeight
        let left = document.getElementById("sidebar").offsetWidth

        addClick(e.pageX - left - wrapper, e.pageY - top - wrapper);

      (curTool == tools.path) 
      ? setPath()
      :  redraw();
    });

    // Mouse move
    $('#canvas').mousemove(function (e) {
        if (paint) {
            let wrapper = 16
            let top = document.getElementById("navbar").offsetHeight
            let left = document.getElementById("sidebar").offsetWidth

            addClick(e.pageX - left - wrapper, e.pageY - top - wrapper, true);

            (curTool == tools.path)
                ? setPath()
                : redraw();
        }
    });

    // Mouse up (stop drawing) - Needs to stay clean
    $('#canvas').mouseup(function (e) {
        paint = false
        redraw();
    });

    // Leave event for drawing over the border:
    $('#canvas').mouseleave(function (e) {
        paint = false
    });

    // This also needs to reset any tools to their defaults
    $('#clear').mouseup(function () {
        // Force clearing "the cache"    
        clearCanvas()
        clickX = []
        clickY = []
        clickDrag = []
        clickColor = []
        clickSize = []
        clickTool = []
    })
}
