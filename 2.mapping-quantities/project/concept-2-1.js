var power
var population
var spend
var personnel
var wars
var largeNuc
var trendNuc

var padding = 50

function preload(){
  power = loadTable('data/concept-2-1/mil-power.csv',
  'csv',
  'header');

  largeNuc = loadTable('data/concept-2-1/nuclear-largest-test.csv',
  'csv',
  'header');
  noOfNuc = loadTable('data/concept-2-1/nuclear-test-numbers.csv',
  'csv',
  'header');
}

function colValsMinMax(source,colName) {
  let vals = source.getColumn(colName);
  let obj = {
    values: vals,
    min: min(vals),
    max: max(vals),
  }
  return obj;
}

function rowValsMinMax(source,rowName) {
  let vals = source.getRow(rowName);
  vals = vals.arr
  if (vals.length == source.getColumnCount()){
    vals.shift()
  }
  vals = vals.map(Number)

  let obj = {
    values: vals,
    min: min(vals),
    max: max(vals),
  }
  return obj;
}

var resetX = 0+padding
var resetY = 0+padding
var x = resetX
var y = resetY

function setup(){
  createCanvas(windowWidth, windowHeight)
  textAlign(CENTER);

  for (var r = 0; r < power.getRowCount(); r++) {
    var year = 1945

    strokeWeight(3)
    stroke(200)
    powVal = rowValsMinMax(power,r);
    line(x,y,width-padding,y)

    for (var i=1;i<11;i++){
      strokeWeight(1)
      var lineDiv = ((height/(power.getRowCount()+1))/10)*i
      line(0+padding,y+lineDiv,width-padding,y+lineDiv)
      //var axis = map(11-i, 1, 11, powVal.min, powVal.max)
      //text(axis, 0+padding, y+lineDiv)
    }

    for (var c = 1; c < power.getColumnCount(); c++) {
      ymap = map(powVal.values[c], powVal.min, powVal.max, 0, height/(power.getRowCount()+3))
      ymap2 = map(powVal.values[c+1], powVal.min, powVal.max, 0, height/(power.getRowCount()+3))
      let powerScale  = chroma.scale('YlGnBu').mode('lch');
      var powerColorVal = map(powVal.values[c+1], powVal.min, powVal.max, 1, 0.5)
      stroke(powerScale(powerColorVal).rgb())
      line(x,y+ymap+(padding/2),x+(width/power.getColumnCount()),y+ymap2+(padding/2))
      fill('#e0e0d9')
      stroke(powerScale(powerColorVal).rgb())
      //circle(x,y+ymap+(padding/2),5)
      noStroke()
      makeObject(x,y+ymap+(padding/2),r,c)
      fill(200)
      if (year%5 == 0) {
        text(year,x,0+padding-5)
      }
      x+= (width-padding)/power.getColumnCount()
      year += 1
    }

    y += height/(power.getRowCount()+1)
    x = resetX
  }
  strokeWeight(3)
  line(x,y,width-padding,y)

  y = resetY

}

function makeObject(x,y,r,c){
  objectSize = width/30
  fill('#e0e0d9')
  strokeWeight(1)
  noStroke()

  //largest nuclear test
  nucSize = rowValsMinMax(largeNuc,r);
  let testScale  = chroma.scale('YlGnBu').mode('lch');
  var testColorVal = map(nucSize.values[c], nucSize.min, nucSize.max, 0.5, 1)
  fill(testScale(testColorVal).rgb())

  //no of nuc tests
  nucNo = rowValsMinMax(largeNuc,r);
  nucRectSize = map(nucNo.values[c+1], nucNo.min, nucNo.max, objectSize/3, objectSize)
  circle(x,y,nucRectSize/2)
  
}
