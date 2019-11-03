var power
var population
var spend
var personnel
var wars
var largeNuc
var trendNuc

var padding = 50
var objectSize;

const nucTestMax = 81;
const mucYieldMax = 58000;
const maxSpend = 317900000;
const minSpend = 214176;
const maxPersonnel = 0.103493148;
const minPersonnel = 0.002150829;
const maxPower = 0.4 //0.3838635;
const minPower = 0.1 //0.0177723

function preload(){
  power = loadTable('data/concept-3/mil-power.csv',
  'csv',
  'header');

  spend = loadTable('data/concept-3/mil-spend.csv',
  'csv',
  'header');
  personnel = loadTable('data/concept-3/mil-personnel.csv',
  'csv',
  'header');

  largeNuc = loadTable('data/concept-3/nuclear-largest-test.csv',
  'csv',
  'header');
  noOfNuc = loadTable('data/concept-3/nuclear-test-numbers.csv',
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
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvas");
  var mainWidth = windowWidth*0.6
  var mainHeight = windowHeight
  var totalsWidth = windowWidth*0.2
  var totalsHeight = windowHeight

  objectSize = width/30
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

    for (var c = 1; c < power.getColumnCount()-3; c++) {
      ymap = map(powVal.values[c], minPower, maxPower, (height/(power.getRowCount()+3))-objectSize+10,0)
      ymap2 = map(powVal.values[c+1], minPower, maxPower, (height/(power.getRowCount()+3))-objectSize+10,0)
      let powerScale  = chroma.scale('YlOrRd').mode('lch');
      var powerColorVal = map(Math.log(powVal.values[c+1]), Math.log(minPower), Math.log(maxPower), 0, 1)
      makeObject(x,y+ymap+(padding/2),x+(width/power.getColumnCount()),y+ymap2+(padding/2),r,c)
      stroke(powerScale(powerColorVal).rgb())
      strokeWeight(4)
      line(x,y+ymap+(padding/2),x+(width/power.getColumnCount()),y+ymap2+(padding/2))

      stroke(200)
      strokeWeight(1)
      fill(powerScale(powerColorVal).rgb())
      circle(x,y+ymap+(padding/2),5)
      noStroke()
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

function makeObject(x,y,x2,y2,r,c){
  fill('#e0e0d9')
  strokeWeight(1)
  noStroke()

  //largest nuclear test
  nucSize = rowValsMinMax(largeNuc,r);
  let testScale  = chroma.scale('YlGnBu').mode('lch');
  var testColorVal = map(Math.log(nucSize.values[c]), 0, Math.log(mucYieldMax), 0, 1)
  fill(testScale(testColorVal).rgb())

  //no of nuc tests
  nucNo = rowValsMinMax(noOfNuc,r);
  //console.log(personnelSize.min, personnelSize.max)

  nucRectSize = map(Math.log(nucNo.values[c]), 0, Math.log(nucTestMax), 0, objectSize)
  nucRectSize2 = map(Math.log(nucNo.values[c+1]), 0, Math.log(nucTestMax), 0, objectSize)
  quad(x, y, x,y-nucRectSize, x2, y2-nucRectSize2, x2,y2);

  //spend
  spendSize = rowValsMinMax(spend,r);
  let spendScale  = chroma.scale('RdPu').mode('lch');
  var spendColorVal = map(Math.log(spendSize.values[c]), Math.log(minSpend), Math.log(maxSpend), 0, 1)

  fill(spendScale(spendColorVal).rgb())

  //personnel
  personnelSize = rowValsMinMax(personnel,r);
  personnelRectSize = map(Math.log(personnelSize.values[c]), Math.log(minPersonnel), Math.log(maxPersonnel), 0, objectSize)
  personnelRectSize2 = map(Math.log(personnelSize.values[c+1]), Math.log(minPersonnel), Math.log(maxPersonnel), 0, objectSize)
  quad(x, y, x,y+personnelRectSize, x2, y2+personnelRectSize2, x2,y2);

}
