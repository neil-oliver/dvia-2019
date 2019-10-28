var power
var population
var spend
var personnel
var wars
var largeNuc
var trendNuc

var padding = 50

function preload(){
  power = loadTable('data/mil-power.csv',
  'csv',
  'header');
  population = loadTable('data/population.csv',
  'csv',
  'header');
  spend = loadTable('data/mil-spend.csv',
  'csv',
  'header');
  personnel = loadTable('data/mil-personnel.csv',
  'csv',
  'header');
  wars = loadTable('data/wars.csv',
  'csv',
  'header');
  largeNuc = loadTable('data/nuc-large-test.csv',
  'csv',
  'header');
  trendNuc = loadTable('data/nuc-trend.csv',
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

  for (var r = 0; r < population.getRowCount(); r++) {
    y += height/(population.getRowCount()+1)
    x = resetX
    x += width/(population.getColumnCount()-1)
    for (var c = 1; c < population.getColumnCount(); c++) {
      makeObject(x,y,r,c)
      x += width/(population.getColumnCount()-1)
    }
  }

}

function makeObject(x,y,r,c){
  objectSize = width/30
  y = y-((height/population.getRowCount())/2)
  fill('#e0e0d9')
  strokeWeight(1)
  noStroke()

  //population
  fill('red')
  popSize = rowValsMinMax(population,r);
  let popScale  = chroma.scale('YlOrRd').mode('lch');
  var popColorVal = map(popSize.values[c+1], popSize.min, popSize.max, 0, 1)
  fill(popScale(popColorVal).rgb())
  cirlceSize = map(popSize.values[c+1], popSize.min, popSize.max, objectSize/2, objectSize)
  circle(x,y,cirlceSize)
  fill('#e0e0d9')
  cirlceSize = map(popSize.values[c], popSize.min, popSize.max, objectSize/2, objectSize)
  circle(x,y,cirlceSize)

  //largest nuclear test
  nucSize = rowValsMinMax(largeNuc,r);
  let testScale  = chroma.scale('PuBu').mode('lch');
  var testColorVal = map(nucSize.values[c], nucSize.min, nucSize.max, 0.5, 1)
  fill(testScale(testColorVal).rgb())
  arcSize = map(nucSize.values[c], nucSize.min, nucSize.max, objectSize/4, objectSize/2)
  arc(x+(objectSize/2), y-(objectSize/2), arcSize, arcSize, 0, PI,CHORD)
  testColorVal = map(nucSize.values[c+1], nucSize.min, nucSize.max, 0.5, 1)
  fill(testScale(testColorVal).rgb())
  arcSize = map(nucSize.values[c+1], nucSize.min, nucSize.max, objectSize/4, objectSize/2)
  arc(x+(objectSize/2), y-(objectSize/2), arcSize*2, arcSize*2, -PI, 0,CHORD)

    //spend
    spendSize = rowValsMinMax(spend,r);
    let spendScale  = chroma.scale('PuBuGn').mode('lch');
    var spendColorVal = map(spendSize.values[c], spendSize.min, spendSize.max, 0.5, 1)
    fill(spendScale(spendColorVal).rgb())
    squareSize = map(spendSize.values[c], spendSize.min, spendSize.max, 0.5, 0.8)
    square(x-(objectSize*squareSize),y,objectSize*squareSize)

    //personnel
    personnelSize = rowValsMinMax(personnel,r);
    let personnelScale  = chroma.scale('YlOrBr').mode('lch');
    var personnelColorVal = map(personnelSize.values[c+1], personnelSize.min, personnelSize.max, 0.5, 1)
    fill(personnelScale(personnelColorVal).rgb())
    rectSize = map(personnelSize.values[c+1], personnelSize.min, personnelSize.max, objectSize, objectSize*2)
    rect(x,y,rectSize,objectSize/10)
    fill('#e0e0d9')
    var personnelColorVal = map(personnelSize.values[c], personnelSize.min, personnelSize.max, 0.5, 1)
    stroke(personnelScale(personnelColorVal).rgb())
    rectSize = map(personnelSize.values[c], personnelSize.min, personnelSize.max, objectSize, objectSize*2)
    rect(x,y+(objectSize/10),rectSize,objectSize/10)

    // wars
    var decadeLookup = [
      "1945-1954",
      "1955-1964",
      "1965-1974",
      "1975-1984",
      "1985-1994",
      "1995-2004",
      "2005-2010"
    ]

    var countryLookup = [
      "CHN",
      "FRN",
      "RUS",
      "UKG",
      "USA"
    ]

    rectSize = map(personnelSize.values[c+1], personnelSize.min, personnelSize.max, objectSize, objectSize*2)
    var warX = x + rectSize
    var warY = y-2

    for (i=0; i< wars.getRowCount();i++){
        if (wars.get(i,"decade") == decadeLookup[c-1] && wars.get(i,"stabb") == countryLookup[r]){
          warSize = map(wars.get(i,"fatality"),0,6,0,0.8)
          let warsScale  = chroma.scale('RdPu').mode('lch');
          if (wars.get(i,"ended_in_decade") == 'TRUE'){
            noStroke()
            fill(warsScale(warSize).rgb())
          } else {
            noFill()
            stroke(warsScale(warSize).rgb())
          }
          circle(warX-(((objectSize/2)*warSize)/2),warY-(((objectSize/2)*warSize)/2),(objectSize/2)*warSize)
          warX += objectSize/5
        }
    }

    // trend
    noFill()
    stroke('orange')
    trend = rowValsMinMax(trendNuc,r);
    var trendCalc
    if (trend.values[c] == 0 || trend.values[c+1] == 0){
      trendCalc = 0
    } else {
      trendCalc = trend.values[c+1] / trend.values[c]
    }
    console.log(trendCalc)

    line(x-objectSize,y,x,y-(trendCalc*2))
}
