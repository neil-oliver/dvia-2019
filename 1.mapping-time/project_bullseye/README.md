# Bullseye
Original design sketch found [here](https://github.com/neil-oliver/dvia-2019/tree/master/1.mapping-time/process)
![](https://github.com/neil-oliver/dvia-2019/blob/master/1.mapping-time/project_bullseye/Bullseye-Screenshot.png)

```JavaScript
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

  var hourSize = h*0.8
  var minSize = h*0.6
  var secSize = h*0.4
  
  //draw hours cirle
  fill(12, 154, 234)
  ellipse(w/2, h/2, ((hourSize-minSize)*now.progress.day)+minSize);
  
  //draw minutes cirle
  fill(255, 76, 76)
  ellipse(w/2, h/2, ((minSize-secSize)*now.progress.hour)+secSize);

  //draw seconds cirle
  fill(255, 221, 92)
  ellipse(w/2, h/2, secSize*now.progress.min);
}
```
