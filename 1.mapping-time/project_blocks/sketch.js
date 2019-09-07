
var spacing = 20

var w = 900
var h = (w/3)*2
var spacing = 10
var maxHeight = (h-(spacing*3))/3

function setup() {
	createCanvas(w, h)
  console.log('starting time:', clock())
}

function colorForProgress(pct,colors){
  var gradient = chroma.scale(colors).mode('lch')
  return gradient(pct).hex()
}

function draw() {
  background(255)
  noStroke()

  var now = clock()

  var secsHeight = (h-(spacing*3))/3
  var minsWidth = ((w-(spacing*3))/3)*2
  var hourWidth = (w-(spacing*3))/3

  var secsWidth = (w-(spacing*2)) * now.progress.sec
  var minsHeight = maxHeight * now.progress.min
  var hourHeight = maxHeight * now.progress.hour

  fill(167, 217, 217)
  rect(spacing, spacing, w-(spacing*2), secsHeight)
  rect(spacing, maxHeight + (spacing*2), minsWidth, maxHeight*2)
  rect(minsWidth+(spacing*2), maxHeight + (spacing*2), hourWidth, maxHeight*2)

  fill(colorForProgress(now.progress.sec,['#1B8CA6','#A7D9D9']))
  rect(spacing, spacing, secsWidth, secsHeight)
  fill(colorForProgress(now.progress.min, ['#0F698C','#A7D9D9']))
  rect(spacing, maxHeight + (spacing*2), minsWidth, minsHeight*2)
  fill(colorForProgress(now.progress.hour,['#022840','#A7D9D9']))
  rect(minsWidth+(spacing*2), maxHeight + (spacing*2) + ((maxHeight*2)-hourHeight*2), hourWidth, hourHeight*2)

}