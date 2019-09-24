
var x = 0 // starting x position to draw
var y = 0 // starting y position to draw

var w = screen.width;
var h = screen.height*0.5;

var space = 10

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
}

function draw() {
  background(50)
  noStroke()

  var rightArray = [4,5,6,7]
  var leftArray = [3,6,5,8]

  //var max = Math.max.apply(Math, rightArray)
  //var min = Math.min.apply(Math, rightArray)

  var posY = h


  for (i = 0; i < rightArray.length; i++) { 
    

    fill(167, 0, 0)
    rect(w/2, posY, rightArray[i]*100, -100)
    fill(0, 0, 167)
    rect(w/2, posY, -leftArray[i]*100, -100)


    posY -= 100+space
  }

}