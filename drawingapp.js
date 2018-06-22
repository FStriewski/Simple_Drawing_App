 // Globals:


 let colors = {
     colorRed: "#dc3545",
     colorGreen: "#659b41",
     colorYellow: "#ffcf33",
     colorPurple: "#cb3594",
     colorBrown: "#986928",
     colorBlack: "#ffffff",
 }

 let sizes = {
     small: 2,
     normal: 5,
     large: 7,
     huge: 10,
 }

 let tools = {
     pen: "pen",
     eraser: "eraser"
 }

let curTool = tools.pen
let curSize = sizes.normal
let curColor = colors.colorPurple

switchTool = (select) => {
    console.log(select)
   // let select = document.getElementById("toolSelect").value
    curTool = tools[select]
}

switchColor = () => {
    let select = document.getElementById("colorSelect").value
    curColor = colors[select]
}

sliderChange = () => {
        let select = document.getElementById("sizeSlider").value
        curSize = select
}

 drawCanvas = () => {

     let canvas = $('#canvas')
     var context = canvas.get(0).getContext("2d");

     let clickX = new Array(); // Array of Number
     let clickY = new Array(); // Array of Number
     let clickDrag = new Array(); // Array of Bool
     let clickColor = new Array();
     let clickSize = new Array();
     let clickTool = new Array();
     let paint;

     // Add a point
     addClick = (x, y, dragging) => {
         clickX.push(x);
         clickY.push(y);
         clickDrag.push(dragging);

         if (curTool == tools.eraser) {
             clickColor.push("white");
             clickSize.push(curSize*2.5);
             document.getElementById("canvas").style.cursor = "all-scroll";

         } else {
             clickColor.push(curColor);
             clickSize.push(curSize);
             document.getElementById("canvas").style.cursor = "cell";
         }

       //  clickColor.push(curColor);
        
     }

     clearCanvas = () => {
         context.clearRect(0, 0, context.canvas.width, context.canvas.height);
     }

     // Redraw action:
     redraw = () => {
         clearCanvas();
         
         console.log(clickX)
         
        context.lineJoin = "round";
        context.lineWidth = 3;
         
         for (let i = 0; i < clickX.length; i++) {
             
             context.beginPath(); 
                (clickDrag[i] && i) // dot or line? Determined by drag t/f
                ?
                context.moveTo(clickX[i - 1], clickY[i - 1]) // Connect to previous node to draw a line?
                : context.moveTo(clickX[i] - 1, clickY[i]) // Set starting point
                
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
         redraw();
     });

     // Mouse move
     $('#canvas').mousemove(function (e) {
         if (paint) {
            let wrapper = 16
            let top = document.getElementById("navbar").offsetHeight
            let left = document.getElementById("sidebar").offsetWidth

            addClick(e.pageX - left - wrapper, e.pageY - top - wrapper, true);            
            redraw();
         }
     });

     // Mouse up (stop drawing)
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
