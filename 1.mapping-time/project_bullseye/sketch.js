
var x = 0 // starting x position to draw
var y = 0 // starting y position to draw

var w = screen.width;
var h = screen.height;

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
}

function draw() {
  background(40)


  noStroke()
  var now = clock()
  var size = h*0.8

  //draw seconds cirle
  fill(255, 221, 92)
  ellipse(w/2, h/2, size*now.progress.sec);

  //draw minutes cirle
  fill(255, 76, 76,150)
  ellipse(w/2, h/2, size*now.progress.min);

  //draw hours cirle
  fill(12, 154, 234,150)
  ellipse(w/2, h/2, size*now.progress.hour);

  // draw scale 
  stroke('#88898E')
  strokeWeight(1)
  line(w/2, h/2, w/2+(h*0.4), h/2)
  hourTickW = w/2

  for (i = 0; i < 13; i++){
    if (i <= now.hour) {
      fill('#42DB00')
    } else {
      fill(40)
    }
    if (1 == 0) {noFill()};
    ellipse(hourTickW, h/2, 10)
    hourTickW += (h*0.4)/12
  }
}