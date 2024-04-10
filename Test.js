
// Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  
  // Function to check whether a point is inside a rectangle
  function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
  }
  
  // The rectangle should have x,y,width,height properties
  var rect1 = {
    name: "stand",
    x: 1100,
    y: 300,
    width: 180,
    height: 100,
    
  };

  var rect2 = {
    name: "hit",
    x: 200,
    y: 300,
    width: 100,
    height: 100,
  };
  
  // Binding the click event on the canvas
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
  
    if (isInside(mousePos, rect1, rect2)) {
      alert('clicked inside rect');
    } else {
      alert('clicked outside rect');
    }
  }, false);
  
  // Question code
  function Playbutton(rect1, rect2, Width, fillColor, lineColor) {
    context.beginPath();
    context.rect(rect1.x, rect1.y, rect1.width, rect1.height);
    context.rect(rect2.x, rect2.y, rect2.width, rect2.height);
    context.fillStyle = 'rgba(225,225,225,0.5)';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.stroke();
    context.closePath();
    context.font = '40px serif';
    context.fillStyle = 'green';
    context.fillText(rect1.name, rect1.x + rect1.width / 7, rect1.y + 64);
    context.fillText(rect2.name, rect2.x + rect2.width / 7, rect2.y + 64);
  }
  Playbutton(rect1, rect2);