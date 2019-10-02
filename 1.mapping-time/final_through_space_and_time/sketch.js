
var w = screen.width;
var h = screen.height;

var orbitCenterX = w/2;
var orbitCenterY = h/2-(h/9);
var orbitRadius = h/4;

var sunAngle = 0

var starX = []
var starY = []

function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
  for (let i=0; i<360; i++){
    starX.push(random(50,width-50))
    starY.push(random(50,height-50))
  }
}

var secTracker = 0

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
var seasonColor = ['#2983A6','#86BF0A','#C91400','#EC7B2B','#2983A6','#2983A6']
var gradient3 = chroma.scale(seasonColor).mode('lch')
function colorForSeason(pct){
  return gradient3(pct).hex()
}


function draw() {
  background(30);
  var now = clock();
  var yearDay = map(now.progress.year,0,1,1,365)
  
  // random stars
  for (let i=0; i< starX.length; i++){
    if (i < yearDay) {
      fill(200)
    } else {
      noFill()
    }
    stroke(100)
    ellipse(starX[i], starY[i], 4, 4);
  }

  // draw lines for hour wave
  beginShape();
  for (var i=0; i<width; i++){
    noFill()
    stroke(100)
    strokeWeight(1)
    let y = sin(map(i+25,0,((width)/24),0,TWO_PI)) * 100
    vertex(i, height-y-200);
  }  
  endShape();
  
  // draw lines for minutes wave
  beginShape();    
  for (var i=0; i<width; i++){
    noFill()
    stroke(100);
    strokeWeight(1)
    let y = sin(map(i,0,((width-1)/60),0,TWO_PI)) * 50
    vertex(i, height-y-150);    

  }
  endShape();

  // draw balls for minutes wave
  for (var i=0; i<60; i++){
    if (i<= now.min){
      fill(255, 76, 76)
    } else {
      noFill()
    }
    let y = sin(map(now.progress.sec,0,1,0,TWO_PI)-(i*(width/60))) * 50
    var x = map(now.progress.min,0,1,0,width)
    stroke(255, 76, 76)
    ellipse(x-(i*(width/60)), height-150- y, 20, 20); 

  }

  // draw balls for hours wave
  for (var i=0; i<24; i++){
    if (i<= now.hours){
      fill(12, 154, 234)
    } else {
      noFill()
    }

    let y = sin(map(now.progress.min,0,1,0,TWO_PI)-(i*(width/24))) * 100
    var x = map(now.progress.hour,0,1,0,width)
    stroke(12, 154, 234)
    ellipse(x-(i*(width/24)), height-y-200, 20, 20);  

  }  

  //map the time to sine and cosine
  yearMap = map(now.progress.year,0,1,0,2*Math.PI) - QUARTER_PI
  dayMap = map(now.progress.day,0,1,0,2*Math.PI) - QUARTER_PI
  monthMap = map(now.progress.month,0,1,0,2*Math.PI) - QUARTER_PI
  yearEndMap = map((1-now.progress.year),0,1,0,2*Math.PI) - QUARTER_PI
  dayEndMap = map((1-now.progress.day),0,1,0,2*Math.PI) - QUARTER_PI
  moonMap = map(now.progress.moon,0,1,0,2*Math.PI) - QUARTER_PI
  moonEndMap = map(1-now.progress.moon,0,1,0,2*Math.PI) - QUARTER_PI

  // change the background at day and night
  //background(colorForBackground(now.progress.day))

  // create variables for next rotation position
  var x = orbitCenterX + orbitRadius * cos(yearMap);
  var y = orbitCenterY + orbitRadius * sin(yearMap);

  //additional location variables for the smaller day orbit
  var x2 = orbitCenterX + orbitRadius * cos(monthMap);
  var y2 = orbitCenterY + orbitRadius * sin(monthMap);

  //additional location variables for the smaller month orbit
  var x3 = x + orbitRadius/2.25* cos(moonMap);
  var y3 = y + orbitRadius/2.25 * sin(moonMap);
  
  noFill()
  stroke(50)
  // draw a large 'orbit path' cirlce with the center point variables above
  ellipse(orbitCenterX, orbitCenterY, h/2, h/2);

  // draw they grey cirlce orbit path
  noFill()
  stroke(50)
  ellipse(x, y, h/4.5, h/4.5);
  noStroke()

  // draw year / season progress bar
  stroke(colorForSeason(now.progress.year));
  strokeWeight(5)
  arc(orbitCenterX,orbitCenterY,h/2,h/2,yearMap,yearMap-yearEndMap);
  strokeWeight(1)
  noStroke()


  // draw moon progress bar
  stroke('#464747');
  strokeWeight(5)
  arc(x,y,h/4.5, h/4.5,moonMap,moonMap-moonEndMap);
  strokeWeight(1)
  noStroke()
  
  // draw the yellow circle
  for (let i=0;i<7; i++){
    var z = map(i,0,6,1,TWO_PI)
    drawSun(z)
  }
  
  // change the color of the blue circle at night
  fill(colorForBlue(now.progress.day))

  // draw the blue circle
  stroke(224, 224, 217);
  ellipse(x, y, h/20, h/20);

  // draw day progress bar
  stroke("#22B573");
  strokeWeight(5)
  arc(x,y,h/20, h/20,dayMap,dayMap-dayEndMap);
  strokeWeight(1)
  noStroke()


  // draw the moon
  stroke(224, 224, 217);
  strokeWeight(0.5)
  fill('#464747');
  ellipse(x3, y3, h/40, h/40);

}

function drawSun(angle){  
  push();
  translate(orbitCenterX, orbitCenterY);
  rotate(angle);
  stroke('#FFE300');
  strokeWeight(5)
  ellipse(0, 0, h/5, h/12);
  stroke(1)
  pop();
}