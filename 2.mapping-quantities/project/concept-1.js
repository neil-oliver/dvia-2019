var data
var padding = 50
function preload(){
  data = loadTable('data/usa-full.csv',
  'csv',
  'header');
}

function colValsMinMax(colName) {
  let vals = data.getColumn(colName);
  let obj = {
    values: vals,
    min: min(vals),
    max: max(vals),
  }
  return obj;
}

function setup(){
  createCanvas(windowWidth, windowHeight)
  background(50);
  stroke(255);
  textAlign(CENTER);
  textSize(50)
  noFill()
  text('USA Nuclear Testing', width/2, 0+padding)

  let colorScale  = chroma.scale(['#85d4d5', '#F0000D']).mode('lch');
  print(data)
  let y = colValsMinMax("height");
  let x = colValsMinMax("date");
  let year = colValsMinMax("year");
  let size = colValsMinMax("yield");
  let seismic = colValsMinMax("seismic");
  let crater = colValsMinMax("crater");

  stroke(150)
  let graphCenter = map(0, y.min, y.max, height-padding, 0+padding);
  line(0+padding,graphCenter,width-padding,graphCenter)
  line(0+padding,0+padding,0+padding,height-padding)


  for (var i = 0; i < data.getRowCount(); i++) {
    
    let xpos = map(x.values[i], x.min, x.max, 0+padding, width-padding);
    var xLabPos = map(year.values[i], year.min, year.max, 0+padding, width-padding);
    let ypos = map(y.values[i], y.min, y.max, height-padding, 0+padding);
    let circleSize = map(size.values[i], size.min, size.max, 1, 400);
    let strokeColor = map(seismic.values[i], seismic.min, seismic.max, 0,1)
    let craterStroke = map(crater.values[i], crater.min, crater.max, 50, 255);


    stroke(craterStroke)
    fill('rgba(100,100,100, 0.25)');
    arc(xpos, graphCenter, crater.values[i]/2, crater.values[i]/2, 0, PI)
    if (crater.values[i] > 500){
      stroke(craterStroke)
      var craterDesc = 'Crater depth of ' + crater.values[i] + 'm.'
      textSize(crater.values[i]/32);
      text(craterDesc, xpos, graphCenter+(crater.values[i]/8));
    }

    stroke(colorScale(strokeColor).rgb())
    fill('rgba(100,100,100, 0.25)');
    circle(xpos, ypos, circleSize)
    var date = data.get(i,'month') + ' / ' + data.get(i,'day') + ' / ' + data.get(i,'year')
    var desc = '\nequiv. to ' + data.get(i,'yield') + ' tons of TNT.'
    
    if (circleSize > 50){
      textSize(circleSize/8);
      text(date, xpos, ypos);
    }
    if (circleSize > 100){
      textSize(circleSize/16);
      text(desc, xpos, ypos);
    }

    textSize(10)
    fill(200)
    noStroke()
    text(year.values[i], xLabPos, graphCenter);
  }

  for (var i=y.min;i<y.max;i+=100){
    var yLabPos = map(i+20, y.min, y.max, height-padding, 0+padding);
    text(i+20, 0+padding, yLabPos);
  }
}
