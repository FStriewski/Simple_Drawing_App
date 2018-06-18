 // Globals:


 let clickColor = new Array();

 let colors = {
     colorPurple: "#cb3594",
     colorGreen: "#659b41",
     colorYellow: "#ffcf33",
     colorBrown: "#986928"
 }

 let curColor = colors.colorPurple

 switchColor = () => {
    let select = document.getElementById("colorSelect").value 
     curColor = colors[select]
 }

 drawCanvas = () => {

     let canvas = $('#canvas')
     //let context = canvas.getContext("2d");
     var context = canvas.get(0).getContext("2d");

     let clickX = new Array(); // Array of Number
     let clickY = new Array(); // Array of Number
     let clickDrag = new Array(); // Array of Bool
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
         context.beginPath();

         context.strokeStyle = "#df4b26";
         context.lineJoin = "round";
         //  context.lineWidth = 3;

         for (let i = 0; i < clickX.length; i++) {


             (clickDrag[i] && i) // dot or line? Determined by drag t/f
             ?
             context.moveTo(clickX[i - 1], clickY[i - 1]) // Connect to previous node to draw a line?
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
         redraw();
     });

     // Leave event for drawing over the border:
     $('#canvas').mouseleave(function (e) {
         paint = false
     });

     $('#clear').mouseup(function () {
         context.clearRect(0, 0, context.canvas.width, context.canvas.height)
         // Force clearing "the cache"    
         clickX = []
         clickY = []
         clickDrag = []
         context.beginPath();
     })
 }
