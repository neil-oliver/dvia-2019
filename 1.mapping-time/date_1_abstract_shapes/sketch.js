

var w = screen.width;
var h = screen.height;
var margin = 100;

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
}

// seasons colors
var seasonColor = ['#2983A6','#86BF0A','#C91400','#EC7B2B','#2983A6']
var gradient = chroma.scale(seasonColor).mode('lab')
function colorForSeason(pct){
  return gradient(pct).hex()
}

// fade the background color
var backgroundColor = ['#E0D9D0','#535454','#E0D9D0']
var gradient2 = chroma.scale(backgroundColor).mode('lab')
function colorForBackground(pct){
  return gradient2(pct).hex()
}

function draw() {


  noStroke();

  var now = clock();
  var bColor = (50,50,50);

  background(bColor);
  
  //calculate widths / heights
  var yearWidth = (width/2) * now.progress.year;
  var monthHeight = (height/2) * now.progress.month;
  var weekWidth = (width/2) * now.progress.week;
  var dayHeight = (height/2) * now.progress.day;

  var secondHeight = (height/2) * now.progress.sec;
  var minuteWidth = (width/2) * now.progress.min;
  var hourHeight = (height/2) * now.progress.hour;
  var dayWidth = (width/2) * now.progress.day;
  
  var x1 = (width/2)-yearWidth;
  var y1 = (height/2);
  var x2 = (width/2);
  var y2 = (height/2)-dayHeight;
  var x3 = (width/2)+weekWidth;
  var y3 = (height/2);
  var x4 = (width/2);
  var y4 = (height/2)+monthHeight;

  // North : Day : X2
  // East : Week : X3
  // South : Month : X4
  // West : Year : X1

  stroke(colorForSeason(now.progress.year));
  strokeWeight(15);
  noFill()
  // draw seasons / calendar shape
  quad(x1, y1, x2, y2, x3, y3, x4, y4);

  // setup progress ball dimensions
  var NEballX = map(now.progress.week,0,1,x2,x3);
  var NEballY = map(now.progress.week,0,1,y2,y3);

  var SEballX = map(now.progress.month,0,1,x3,x4);
  var SEballY = map(now.progress.month,0,1,y3,y4);

  var SWballX = map(now.progress.year,0,1,x4,x1);
  var SWballY = map(now.progress.year,0,1,y4,y1);

  var NWballX = map(now.progress.day,0,1,x1,x2);
  var NWballY = map(now.progress.day,0,1,y1,y2);
  
  noStroke();
  fill(bColor);
  var ballSize = 10;
  // drawy progress balls
  ellipse(NEballX, NEballY, ballSize);
  ellipse(SEballX, SEballY, ballSize);
  ellipse(SWballX, SWballY, ballSize);
  ellipse(NWballX, NWballY, ballSize);

  // North : Second : X2
  // East : Minute : X3
  // South : Hour : X4
  // West : Day : X1
  
  // setup clock / day & night shape and repeat process
  x1 = (width/2)-dayWidth;
  y1 = (height/2);
  x2 = (width/2);
  y2 = (height/2)-secondHeight;
  x3 = (width/2)+minuteWidth;
  y3 = (height/2);
  x4 = (width/2);
  y4 = (height/2)+hourHeight;

  stroke(colorForBackground(now.progress.day));
  strokeWeight(15);
  noFill()
  quad(x1, y1, x2, y2, x3, y3, x4, y4);

  // setup progress ball dimensions
  NEballX = map(now.progress.min,0,1,x2,x3);
  NEballY = map(now.progress.min,0,1,y2,y3);

  SEballX = map(now.progress.hour,0,1,x3,x4);
  SEballY = map(now.progress.hour,0,1,y3,y4);

  SWballX = map(now.progress.day,0,1,x4,x1);
  SWballY = map(now.progress.day,0,1,y4,y1);

  NWballX = map(now.progress.sec,0,1,x1,x2);
  NWballY = map(now.progress.sec,0,1,y1,y2);
  
  noStroke();
  fill(bColor);
  ellipse(NEballX, NEballY, ballSize);
  ellipse(SEballX, SEballY, ballSize);
  ellipse(SWballX, SWballY, ballSize);
  ellipse(NWballX, NWballY, ballSize);
  
}