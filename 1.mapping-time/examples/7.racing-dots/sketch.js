var x = 20 // starting x position to draw
var y = 20  // starting y position to draw

var w = screen.width;
var h = screen.height*0.5;

var discrete = false // flag whether to have the bars 'tick' from one value to the next or move smoothly,
                    // try setting it to false and see what happens...

//this gets called only once in the very beginning
function setup() {
	createCanvas(w, h)
}

//this gets called every frame (about 60 frames per second)
function draw() {
  background(224, 224, 217)
  noStroke()

  // measure the current time & calculate the width in pixels of each bar
  var now = clock()
  if (discrete){
    // the map() function lets us *normalize* a value from a starting range then *project* it into another range
    var hourWidth = map(now.hour, 1,12, 0,w) // from hours (1-12) to pixels (0–maxWidth)
    var minsWidth = map(now.min,  0,60, 0,w)  // from mins (0–60) to pixels (0–maxWidth)
    var secsWidth = map(now.sec,  0,60, 0,w)  // from secs (0–60) to pixels (0–maxWidth)
  }else{
    // alternatively, we can use the clock's 'progress' percentages
    hourWidth = w * now.progress.day
    minsWidth = w * now.progress.hour
    secsWidth = w * now.progress.min
  }

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