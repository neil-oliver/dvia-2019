
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

// fade the background color
var backgroundColor = ['#E0D9D0','#535454','#E0D9D0']
var gradient = chroma.scale(backgroundColor).mode('lab')
function colorForBackground(pct){
  return gradient(pct).hex()
}

// fade the blue circle color
var blueColor = ['#19BAFF','#004C6C','#19BAFF']
var gradient2 = chroma.scale(blueColor).mode('lab')
function colorForBlue(pct){
  return gradient2(pct).hex()
}

// seasons colors
var seasonColor = ['#2983A6','#86BF0A','#C91400','#EC7B2B','#2983A6']
var gradient3 = chroma.scale(seasonColor).mode('lab')
function colorForSeason(pct){
  return gradient3(pct).hex()
}


function draw() {
  
  noStroke()

  var now = clock()
  //map the time to sine and cosine
  yearMap = map(now.progress.year,0,1,0,2*Math.PI)
  dayMap = map(now.progress.day,0,1,0,2*Math.PI)
  monthMap = map(now.progress.month,0,1,0,2*Math.PI)


  // change the background at day and night
  background(colorForBackground(now.progress.day))


  // create variables for next rotation position
  var x = orbitCenterX + orbitRadius * cos(yearMap);
  var y = orbitCenterY + orbitRadius * sin(yearMap);

  //additional location variables for the smaller day orbit
  var x2 = orbitCenterX + orbitRadius * cos(monthMap);
  var y2 = orbitCenterY + orbitRadius * sin(monthMap);

  //additional location variables for the smaller month orbit
  var x3 = x2 + orbitRadius/2.25* cos(dayMap);
  var y3 = y2 + orbitRadius/2.25 * sin(dayMap);
  
  noFill()
  stroke(200)
  // draw a large 'orbit path' cirlce with the center point variables above
  ellipse(orbitCenterX, orbitCenterY, h/2, h/2);
  noStroke()
  
  // drawe the yellow cirlce
  stroke(224, 224, 217);
  fill('#FFE300')
  ellipse(orbitCenterX, orbitCenterY, h/6, h/6);
  
  // draw they grey cirlce orbit path
  noFill()
  stroke(200)
  ellipse(x2, y2, h/4.5, h/4.5);
  noStroke()

  // change the color of the blue circle at night
  fill(colorForBlue(now.progress.day))

  
  // draw the blue circle
  stroke(224, 224, 217);
  ellipse(x2, y2, h/20, h/20);

  // draw the seasons circle
  fill(colorForSeason(now.progress.year))
  ellipse(x, y, h/15, h/15);

  // draw the grey circle
  fill('#535454');
  ellipse(x3, y3, h/40, h/40);

  


}