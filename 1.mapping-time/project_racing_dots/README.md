# Racing Dots
Original design sketch found [here](https://github.com/neil-oliver/dvia-2019/tree/master/1.mapping-time/process)
![](https://github.com/neil-oliver/dvia-2019/blob/master/1.mapping-time/project_racing_dots/Racing-dots-screenshot.png)

## Code
```javascript
var x = 0 // starting x position to draw
var y = 0 // starting y position to draw

var w = screen.width;
var h = screen.height*0.5;

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
}

function draw() {
  background(224, 224, 217)
  noStroke()

  var now = clock()
  hourWidth = w * now.progress.day
  minsWidth = w * now.progress.hour
  secsWidth = w * now.progress.min

  //draw hours cirle
  fill(110, 223, 168)
  ellipse(hourWidth, 30, 60, 60);
  
  //draw minutes cirle
  fill(12, 154, 234)
  ellipse(minsWidth, h*0.5, 40, 40);

  //draw seconds cirle
  fill(255, 76, 76)
  ellipse(secsWidth, h-10, 20, 20);
}
```
