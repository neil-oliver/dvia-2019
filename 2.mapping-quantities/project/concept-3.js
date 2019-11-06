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
const conflictMax = 11
const conflictScoreMax = 109

function preload(){
  //font = loadFont('https://fonts.googleapis.com/css?family=Jomolhari&display=swap');
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
  conflicts = loadTable('data/concept-3/wars.csv',
  'csv',
  'header');
  conflictScore = loadTable('data/concept-3/conflict-score.csv',
  'csv',
  'header');
  totals = loadTable('data/concept-3/totals.csv',
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

var resetX;
var resetY;
var x;
var y;
var country = ['China','France','USSR','UK','USA']
var totalsWidth;
var totalsHeight;

function setup(){
  cnv = createCanvas(1920, 1130);
  console.log(windowWidth, windowHeight)
  cnv.parent("canvas");
  var mainWidth = width*0.6
  var mainHeight = height
  totalsWidth = width*0.15
  totalsHeight = height
  resetX = width*0.25
  resetY = 0+padding
  x = resetX
  y = resetY

  objectSize = mainWidth/30
  textAlign(CENTER);
  noStroke()
  fill(100)
  text('1954 - 1995 Totals',width-(totalsWidth/2)-(padding/2),resetY)
  textFont('Helvetica');
  var description = "In 1963 J. David Singer created the Composite Index of National Capability (CINP) as part of the Correlates of War project. The index uses 6 values to give a statistical value of State power beyond GDP. The index is still today considered to be still among the best-known and most accepted methods for measuring national capabilities.\n\
  \nFocusing on 5 countries (USSR includes Russia after 1991), the central white line of the graph shows the rise and fall of each country based on the CINP value.\n\
  \nTo compare the index to purely military values, above each line tracks each countries nuclear activity over 50 years and below the line follows each countries military personnel and military spend. Each central dot indicates the number and severity of International conflicts within the year.\n\
  \nThe graph demonstrates the huge increase in military power however it does not seem to correlate to a States capability as measured by the CINP. "
  textAlign(LEFT)
  textSize(35)
  fill(50)
  textStyle(BOLD);
  text('Does the most powerful army mean the most powerful country?',padding,padding/2,(width*0.2)-10,mainHeight*0.6)
  textSize(15)
  text('TLDR: No.',padding,(height*0.2)-(padding*0.2),(width*0.2)-10,mainHeight*0.6)
  textStyle(NORMAL);
  fill(100)
  textSize(14)
  text(description,padding,(height*0.2)+(padding*0.6),(width*0.2)-padding,mainHeight*0.6)
  textAlign(CENTER)

  for (var r = 0; r < power.getRowCount(); r++) {
    var year = 1945

    strokeWeight(3)
    stroke(200)
    powVal = rowValsMinMax(power,r);
    line(x,y,resetX+mainWidth-padding,y)
    
    //totals brackets
    strokeWeight(4)
    line(x+mainWidth-(padding/2),y+10,x+mainWidth-(padding/2),y+(mainHeight/6.5))
    line(width-(padding/2),y+10,width-(padding/2),y+(mainHeight/6.5))
    line(width-(padding/2),y+10,width-(padding/2)-50,y+10)
    line(width-(padding/2),y+(mainHeight/6.5),width-(padding/2)-50,y+(mainHeight/6.5))
    line(x+mainWidth-(padding/2),y+10,x+mainWidth-(padding/2)+50,y+10)
    line(x+mainWidth-(padding/2),y+(mainHeight/6.5),x+mainWidth-(padding/2)+50,y+(mainHeight/6.5))

    var halfRowHeight = ((height/(power.getRowCount()+2))/2)
    noStroke()
    fill(100)
    textSize(15)
    text(country[r],x-(width/40),y+halfRowHeight)
    stroke(200)
    textSize(11)

    //small lines
    for (var i=1;i<11;i++){
      strokeWeight(1)
      var lineDiv = ((mainHeight/(power.getRowCount()+1))/10)*i
      line(resetX,y+lineDiv,resetX+mainWidth-padding,y+lineDiv)
      fill(200)
      if (i != 10){
        text(10-i,resetX-10,y+lineDiv+5)
      }
    }

    //CINP line
    for (var c = 1; c < power.getColumnCount()-2; c++) {
      ymap = map(powVal.values[c], minPower, maxPower, (mainHeight/(power.getRowCount()+3))-objectSize+10,0)
      ymap2 = map(powVal.values[c+1], minPower, maxPower, (mainHeight/(power.getRowCount()+3))-objectSize+10,0)

      makeObject(x,y+ymap+(padding/2),x+(mainWidth/power.getColumnCount()+1),y+ymap2+(padding/2),r,c)
      stroke(255)
      strokeWeight(3)
      line(x,y+ymap+(padding/2),x+(mainWidth/power.getColumnCount()),y+ymap2+(padding/2))
      
      //conflicts
      conflictsSize = rowValsMinMax(conflicts,r);
      conflictsCircleSize = map(Math.log(conflictsSize.values[c]), 0, Math.log(conflictMax), 0, objectSize/2)
      let conflictScale  = chroma.scale('YlOrRd').mode('lch');
      let conflictVal = rowValsMinMax(conflictScore,r);
      var conflictColorVal = map(conflictVal.values[c], 0, conflictScoreMax, 0, 1)
      fill(conflictScale(conflictColorVal).rgb())
      strokeWeight(1)
      circle(x,y+ymap+(padding/2),conflictsCircleSize)

      noStroke()
      fill(100)
      if (year%5 == 0) {
        text(year,x,0+padding-5)
      }
      x+= (mainWidth-padding)/(power.getColumnCount()-3)
      year += 1
    }
    //totals
    for (var c = 1; c < totals.getColumnCount()-1; c++) {
      makeTotal(mainWidth-totalsWidth,y,r,c)
    }

    y += mainHeight/(power.getRowCount()+1)
    x = resetX

  }
  fill(100)
  noStroke()
  text('1995',x+mainWidth-padding,0+padding-5)

  strokeWeight(3)
  stroke(200)
  line(x,y,resetX+mainWidth-padding,y)

  y = resetY

  loadImage('quantities-key.svg', img => {
    image(img,padding/2,height-(width*0.19)-(padding*2),width*0.2,width*0.2);
  });


  //save('war.svg')
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

function makeTotal(x,y,r,c){
  strokeWeight(1)
  //totals
  totalColor = [
    'YlGnBu',
    'YlGn',
    'YlGn',
    'YlOrRd'
  ]
  totalSize = rowValsMinMax(totals,c-1);
  let totalScale = chroma.scale('reds').mode('lch');
  var totalColorVal = map(totalSize.values[r], totalSize.min, totalSize.max, 0, 1)
  fill(totalScale(totalColorVal).rgb())
  totalsRectSize = map(totalSize.values[r], totalSize.min, totalSize.max, 0, totalsWidth-padding)
  var rectY = y+(c*(totalsHeight/30))
  var rectHeight = totalsHeight/120
  stroke('255')
  strokeWeight(2)
  rect(width-totalsWidth,rectY,totalsRectSize,rectHeight)
  noStroke()
  fill(100)
  textAlign('left')
  totalsText = [
    `${totalSize.values[r]} Nuclear Tests`,
    `\$${totalSize.values[r]} Million Military Spend`,
    `${totalSize.values[r]} Thousand Military Personnel`,
    `${totalSize.values[r]} International Conflicts`
  ]

  text(totalsText[c-1],width-totalsWidth+5,y+(c*(totalsHeight/30)-7))
  textAlign('center')
}
