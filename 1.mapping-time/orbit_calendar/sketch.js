
var w = screen.width;
var h = screen.height;

var orbitCenterX = w/2;
var orbitCenterY = h/2;
var orbitRadius = h/4;

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
}

function draw() {
  
  noStroke()

  var now = clock()
  minMap = map(now.progress.hour,0,1,0,2*Math.PI)
  secMap = map(now.progress.min,0,1,0,2*Math.PI)

  if (now.progress.hour > 0.5){
    background('#535454')
  }else{
    background(224, 224, 217)
  }  

  var x = orbitCenterX + orbitRadius * cos(minMap);
  var y = orbitCenterY + orbitRadius * sin(minMap);
  var x2 = x + orbitRadius/2.25* cos(secMap);
  var y2 = y + orbitRadius/2.25 * sin(secMap);
  
  noFill()
  stroke(200)
  ellipse(orbitCenterX, orbitCenterY, h/2, h/2);
  noStroke()
  
  stroke(224, 224, 217);
  fill('#FFE300')
  ellipse(orbitCenterX, orbitCenterY, h/6, h/6);
  
  noFill()
  stroke(200)
  ellipse(x, y, h/4.5, h/4.5);
  noStroke()

  if (now.progress.hour > 0.5){
    fill('#004C6C')
  }else{
    fill('#19BAFF')
  }
  stroke(224, 224, 217);
  ellipse(x, y, h/20, h/20);
  fill('#535454');
  ellipse(x2, y2, h/40, h/40);

  


}