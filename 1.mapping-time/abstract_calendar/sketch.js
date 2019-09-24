

var w = screen.width;
var h = screen.height;

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
}

function draw() {


  noStroke()

  var now = clock()
  var bColor = (50,50,50)

  if (now.progress.day < 0.5){
    bColor = (224, 224, 217)
  } else {
    bColor = (50,50,50)
  }

  background(bColor)

  yearWidth = (width/2) * now.progress.month
  monthWidth = (height/2) * now.progress.week
  weekWidth = (width/2) * now.progress.day
  dayWidth = (height/2) * now.progress.hour
  

  //draw hours cirle
  // North : Day
  // East : Week
  // South : Month
  // West : Year
  stroke(255,0,0)
  strokeWeight(10)
  fill(bColor)
  quad((width/2)-yearWidth, (height/2), (width/2), (height/2)-dayWidth, (width/2)+weekWidth, (height/2), (width/2), (height/2)+monthWidth)


}