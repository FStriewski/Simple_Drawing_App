
context = document.getElementById("canvas").getContext('2d');

// ---Globals:

let clear = document.getElementById("clear");
let gBezierPath;

let mode = {
    add: "add",
    select: "select",
    move: "move",
    delete: "delete",
}

let tools = {
    pen: "pen",
    eraser: "eraser",
    crayon: "crayon",
    path: "path",
}

let curTool = tools.pen
let curSize = 5
let curColor = "#e66465"
let curMode = mode.add

// Needed for Mouse Position
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3
        this.select_radius = this.radius + 2;
    }

    drawSquare (context) {
        context.fillRect(
              this.x - this.radius, 
              this.y - this.radius, 
              this.radius * 2, 
              this.radius * 2
            )
      }
}

class Segment {
    constructor(pt, prev) {
            this.pt = pt
            this.prev = prev
            this.next 
    }

    draw (context) {
        this.pt.drawSquare(context);
        // Draw control points if we have them

        // If there are at least two points, draw curve.
        if (this.prev)
            this.drawCurve(context, this.prev.pt, this.pt);
    }

         drawCurve (context, startPt, endPt) {
            context.save();
            context.fillStyle = 'black';
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(startPt.x(), startPt.y());
            context.lineTo(startPt.x(), startPt.y());
            context.bezierCurveTo(ctrlPt1.x(), ctrlPt1.y(), ctrlPt2.x(), ctrlPt2.y(), endPt.x(), endPt.y());
            context.stroke();
            context.restore();
        }

    


}

class Path {
    constructor(startPoint){
        this.startPoint = this.addPoint(startPoint)
        
        this.start = null;
        this.end = null;
    }

    addPoint(pt) {
      //  let newPt = new LineSegment(pt, end)
        let newPt = new Segment(pt, this.end)
            if (this.end == null) 
            {
                this.end = newPt,
                this.start = newPt
            } else {
                this.end.next = newPt,
                this.end = this.end.next
            }
            console.log(newPt)
        return newPt;
    }

    draw (context) {
            if (this.start == null)
                return;

            var current = this.start;
            while (current != null) {
                current.draw(context);
                current = current.next;
            }
        };          
}


// ---Helper:

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

switchMode = (select) => {
    curMode = mode[select]
}

 getMousePosition = e => {

    let top = document.getElementById("navbar").offsetHeight
    let left = document.getElementById("sidebar").offsetWidth
    let wrapper = 16

    let x = e.pageX - left - wrapper
    let y = e.pageY - top - wrapper

    let output = new Point(x, y);
   // console.log(output)
    return output
}

 setPath = e => {
    var pos = getMousePosition(e);
    switch (curMode) {
         case "add":
             handleAdd(pos);
             break;
    //     case Mode.kSelecting:
    //         handleDownSelect(pos);
    //         break;
    //     case Mode.kRemoving:
    //         handleDownRemove(pos);
    //         break;
    default:
    console.log("nil")
    }
}

handleAdd = (pos) => {
    if (!gBezierPath) {
      //  gBezierPath = new Path(pos);
      const output = new Segment(pos)
      console.log(output)
        output.draw(context)
    }
    else {
        // If this was probably a selection, change to
        // select/drag mode
        //  if (handleDownSelect(pos))
          //  return;
        gBezierPath.addPoint(pos);
    }
   // render();
}

 render =() => {
    gBackCtx.clearRect(0, 0, WIDTH, HEIGHT);
    context.clearRect(0, 0, WIDTH, HEIGHT);
   // if (gBackgroundImg)
     //   gBackCtx.drawImage(gBackgroundImg, 0, 0);
    if (gBezierPath) {
        gBezierPath.draw(gBackCtx);
    //    var codeBox = document.getElementById('putJS');
    //    codeBox.innerHTML = gBezierPath.toJSString();
    }
    context.drawImage(gBackCanvas, 0, 0);
}




// ----Main:

drawCanvas = () => {

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

    INACTIVEsetPath = () => {
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
    canvas.addEventListener('mousedown', function (e) {
        paint = true;
        //handleDown(e) 

        let wrapper = 16
        let top = document.getElementById("navbar").offsetHeight
        let left = document.getElementById("sidebar").offsetWidth

        addClick(e.pageX - left - wrapper, e.pageY - top - wrapper);

      (curTool == tools.path) 
      ? setPath(e)
      :  redraw();
    });

    // Mouse move
    canvas.addEventListener('mousemove', function (e) {

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
    canvas.addEventListener('mouseup', function (e) {
        paint = false
        redraw();
    });

    // Leave event for drawing over the border:
    canvas.addEventListener('mouseleave', function (e) {
        paint = false
    });

    // This also needs to reset any tools to their defaults
    clear.addEventListener('mouseup', function () {
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

drawCanvas()

// ----------------------------------------------------------------

