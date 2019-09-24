

var w = screen.width;
var h = screen.height;


function setup() {
  // set the width & height of the sketch
	createCanvas(w, h)
  console.log('starting time:', clock())
}

var dayCount = 0;
var weekCount = 0;
var monthCount = 0;
var dayTracker = 0;
var monthTracker = 0;

var monthColor = ["#0071BC","#29ABE2","#00A99D","#22B573","#8CC63F","#F15A24","#ED1C24","#C1272D","#F7931E","#FBB03B","#662D91","#1B1464"]
var gradient = chroma.scale(monthColor).mode('lab')
function colorForProgress(pct){
  return gradient(pct).hex()
}

function draw() {

  noStroke()

  var now = clock()
  var bColor = (50,50,50)
  
  // if (now.progress.day < 0.5){
  //   bColor = (224, 224, 217)
  // } else {
  //   bColor = (50,50,50)
  // }

  var timeAngle = map(now.progress.day,0,1,0,360)
  var angles = [timeAngle];

  //monthCount = Math.round(now.progress.year*12)

  background(bColor)

  // keep track of each passing day
  if (now.progress.day > dayTracker) {
    dayTracker = now.progress.day
  } else {
    dayTracker = now.progress.day
    if (dayCount == 6) {
      dayCount = 0;
      weekCount += 1
    } else {
      dayCount += 1
    }
  }

  // keep track of the month
  if (now.progress.month > monthTracker) {
    monthTracker = now.progress.month
  } else {
    monthTracker = now.progress.month
    monthCount += 1;
    dayCount = 0;
    weekCount = 0;
    if (monthCount == 12){
      monthCount = 1;
    }
  }

  dayAngle = map(now.progress.day,0,1,0,radians(360))
  monthAngle = map(now.progress.month,0,1,0,radians(360))

  
  
  let x = width/14;
  let y = (height/10)*3;
  var piecolor = colorForProgress(now.progress.year)
  
  // week pie charts
  for (let i = 0; i < 5; i++){
    for (let z = 0; z < 7; z++){
      dayChart(100, angles,x,y,piecolor,z,i);
      x += width/7
    }
    y += height/10
    x = width/14;
  }

  // month pice charts
  let monthX = width/24
  for (let i = 0; i < 12; i++){
    monthChart(100, angles,monthX,height/10,monthColor[i],i);
    monthX += width/12
  }
}

function dayChart(diameter, data,x,y,color,day,week) {

  // 12 o'clock position
  let lastAngle = 300;

  noFill();
  stroke(color)
  strokeWeight(5)
  arc(x,y,diameter,diameter,lastAngle,lastAngle);

  if (dayCount > day && weekCount >= week) {
    fill(color);
    arc(x,y,diameter,diameter,lastAngle,lastAngle);
  }
  if (weekCount > week) {
    fill(color);
    arc(x,y,diameter,diameter,lastAngle,lastAngle);
  }

  if (dayCount == day && weekCount == week){
    for (let i = 0; i < data.length; i++) {
      fill(color);
      arc(x,y,diameter,diameter,lastAngle,lastAngle + dayAngle);
    }
  } 
}

function monthChart(diameter, data,x,y,color,month) {

  // 12 o'clock position
  let lastAngle = 300;

  noFill();
  stroke(color)
  strokeWeight(5)
  arc(x,y,diameter,diameter,lastAngle,lastAngle);

  if (monthCount > month) {
    fill(color);
    arc(x,y,diameter,diameter,lastAngle,lastAngle);
  }

  if (monthCount == month){
    for (let i = 0; i < data.length; i++) {
      fill(color);
      arc(x,y,diameter,diameter,lastAngle,lastAngle + monthAngle);
    }
  } 
}