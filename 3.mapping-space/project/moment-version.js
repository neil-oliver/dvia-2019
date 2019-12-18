// the data loaded from a USGS-provided CSV file
var table;
var w = window.innerWidth;
var h = window.innerHeight;
var totalCount = 0;

var xPos = w*0.1
var graphData;

// my leaflet.js map
var mymap;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    //table = loadTable("../data/all_month.csv", "csv", "header");
    //table = loadTable("./all_month.csv", "csv", "header"); //testing
    table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv", "csv", "header"); //Live


}

var heatMap = {}
var heatMapMax = Number.NEGATIVE_INFINITY
var heatMapMin = Number.POSITIVE_INFINITY
var depthMap = {}
var depthMapMax = Number.NEGATIVE_INFINITY
var depthMapMin = Number.POSITIVE_INFINITY
var mapAccuracy = 1

function heatmap(){
    console.log('running')
    for (var i=0; i<table.getRowCount(); i++){
        var row = table.getRow(i)
        var day = moment(row.get('time')).format('M-D-Y');
        var mag = row.getNum('mag').toFixed(mapAccuracy)
        var depth = row.getNum('depth').toFixed(0)

        if (!heatMap.hasOwnProperty(day)){
            heatMap[day] = {}
        }

        if (!heatMap[day].hasOwnProperty(mag)){
            heatMap[day][mag] = 1
        } else {
            heatMap[day][mag] += 1
        }
        /////////////
        //depth

        if (!depthMap.hasOwnProperty(day)){
            depthMap[day] = {}
        }

        if (!depthMap[day].hasOwnProperty(depth)){
            depthMap[day][depth] = 1
        } else {
            depthMap[day][depth] += 1
        }

        for (date in heatMap){
            for (magnitude in heatMap[date]){
                if (heatMap[date][magnitude] > heatMapMax){
                    heatMapMax = heatMap[date][magnitude]
                }
                if (heatMap[date][magnitude] < heatMapMin){
                    heatMapMin = heatMap[date][magnitude]
                }
            }
        }

        for (date in depthMap){
            for (dep in depthMap[date]){
                if (depthMap[date][dep] > depthMapMax){
                    depthMapMax = depthMap[date][dep]
                }
                if (depthMap[date][dep] < depthMapMin){
                    depthMapMin = depthMap[date][dep]
                }
            }
        }
    }
    console.log(heatMap, heatMapMin, heatMapMax)

    console.log(depthMap, depthMapMin, depthMapMax)

}
var magMax;
var magMin;
var depthMax;
var depthMin;

function setup() {
    magMax = columnMax(table, "mag");
    magMin = columnMin(table, "mag");
    depthMax = columnMax(table, "depth");
    depthMin = columnMin(table, "depth");
    // first, call our map initialization function (look in the html's style tag to set its dimensions)
    heatmap()
    setupMap()
    frameRate(60)
    // generate a p5 diagram that complements the map, communicating the earthquake data non-spatially
    var canvas = createCanvas(w, h*0.50)
    canvas.parent('graph')
}
let markers;
var monthInMilliseconds = 2592000000
var start = new Date()
start = start.getTime()
var now = start - monthInMilliseconds;
var interval = 1440000; //1440000 //one day /60
var nowDay;
var thenDay;
var fillMap;
var fade;
var all = false

function setupMap(){
    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map',{
        center: [40.7831, -73.9712],
        zoom: 4
    });

    // load a set of map tiles – choose from the different providers demoed here:
    // https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 3,
        minZoom: 3,
        id: 'dark-v10',
        accessToken: 'pk.eyJ1Ijoib2xpdm44OTciLCJhIjoiY2szNmx0dHZqMDA0YzNibnpmem1sM25tOCJ9.lkY_8AlzmT_xunxlmXQYDg'
    }).addTo(mymap);

    
    markers = L.layerGroup().addTo(mymap);

}

$('#dateslider').val(0);
$('#dateslider').on("input change", function(e) {
    now = map($(this).val(),0,900,start-monthInMilliseconds, start+1)
    markers.clearLayers();
    addCircles();
    $('#datetime').html(moment(now).format('LLLL'))
})

$('#playbutton').on('click', function(e){
    if ($(this).hasClass('active')){
        $(this).html('Stop')
        loop()
        draw()
    } else {
        $(this).html('Play')
        noLoop()
        draw()
    }
})

function draw(){
    //total countup
    if (totalCount < table.getRowCount()){
        if(totalCount + 313 > table.getRowCount()){
            totalCount = table.getRowCount()
        } else {
            totalCount += 313
        }
        $('#total').html(numberWithCommas(totalCount))
    }

    clear();
    setupGraph()

    xPos = w*0.1

    if (now >= start){
        // one the animation has finished, show all
        addCircles();
        noLoop()
        $('#playbutton').html('Stop')

        //pan to a final point
        //mymap.panTo([0, 0],{animate:true});

    }

        $('#dateslider').val( function(i, oldval) {
            return parseInt( oldval, 10) + 1;
        });
        now = map($('#dateslider').val(),0,900,start-monthInMilliseconds, start+1)
        markers.clearLayers();
        $('#datetime').html(moment(now).format('LLLL'))

        // call our function (defined below) that populates the maps with markers based on the table contents
        addCircles();

}

function addCircles(){

    ///////////////////////////////////////////////
    // graph setup
    var xPadding = 0// width*0.1
    var yPadding = height*0.1
    var yMiddle = height/2
    var magYmiddle = (height/2)-yPadding
    var depthYmiddle = (height/2)+yPadding
    ////////////////////////////////////////////////


    // calculate minimum and maximum values for magnitude and depth
    var magnitudeMin = 0.0;
    var magnitudeMax = columnMax(table, "mag");

    var depthMin = 0.0;
    var depthMax = columnMax(table, "depth");

    var magErrorMin = 0.0;
    var magErrorMax = columnMax(table, "magError");


    // step through the rows of the table and add a dot for each event
    for (var i=0; i<table.getRowCount(); i++){
        var row = table.getRow(i)

        // skip over any rows where the magnitude data is missing
        if (row.get('mag')==''){
            continue
        }

        var then = row.get('time')

        if (then > now && all == false){
            break
        }

        then = new Date(then);
        then = then.getTime()

        //check if the last run through to show all
        if (now >= start){
            fade = monthInMilliseconds
            all = true
         } else {
            fade = interval*(10*row.get('mag'))
            all = false
         }



        if (then < now && then > now-fade){

            var quakeColor = 'OrRd'

            var type = row.get('type')
   
           if (type == 'quarry blast'){
               quakeColor = 'BuGn'
           } else if (type == 'ice quake'){
               quakeColor = 'PuBu'
           } else if (type == 'explosion'){
               quakeColor = 'Purples'
           }
   
           let magScale  = chroma.scale(quakeColor).mode('lch');
           var magColorVal = map(row.getNum('mag'), magnitudeMin, magnitudeMax, 0, 1)
           var magErrorMap;

            if (row.get('magError')==''){
                magErrorMap = 0
            } else {
                magErrorMap = map(row.getNum('magError'), magErrorMin, magErrorMax, 0, 5)
            }

            var timeMap = map(now-then, 0,fade,1,0)

             if (now >= start){
                $('#datetime').html('Past 30 Days')
                fillMap = 0
                timeMap = 1
             } else {
                fillMap = timeMap;
             }


            // create a new dot
            var circle = L.circle([row.getNum('latitude'), row.getNum('longitude')], {
                color: magScale(magColorVal).hex(),      // the dot stroke color
                fillColor: magScale(magColorVal).hex(), // the dot fill color
                fillOpacity: fillMap,  // use some transparency so we can see overlaps
                opacity: timeMap,
                weight: 1, //magErrorMap,
                radius: Math.pow(row.getNum('mag'),3)*2000
            }).bindPopup(row.get('place') + '<br>Magnitude: ' + row.getNum('mag').toString() + '<br>Depth: ' + row.getNum('depth').toString()  + 'km<br>Type: ' + row.get('type').toString() + '<br>'+ moment(row.get('time')).format('LLLL')).addTo(markers);
            
            //move to marker over 6 magnitude
            // if (row.getNum('mag')>6 && then > now-interval){
            //     mymap.panTo([row.getNum('latitude'), row.getNum('longitude')],{animate:true});
            // }

        }


        //this is sloooooooow
        if (then < now){
            console.log(then, now)
            if (moment(then).startOf('day').valueOf() == moment(now).startOf('day').valueOf() || all == true){
                
                ///////////////////////////////////////////////
                // create graph 
                var timescale = map(moment(then).startOf('day').valueOf(), start-monthInMilliseconds, start, xPadding, width-xPadding-(barWidth*2))
                var magGraphScale = map(row.getNum('mag'),0,magMax,0, height*0.3)
                var depthGraphScale = map(row.getNum('depth'),0,depthMax,0, height*0.3)

                var barWidth = (width*0.8)/35
                strokeWeight(2)
                magScale  = chroma.scale('RdPu').mode('lch');

                //var magColorVal = map(heatMap[moment(row.get('time')).format('M-D-Y')][row.getNum('mag').toFixed(mapAccuracy)], heatMapMin, heatMapMax, 0.4, 1)
                var magColorVal = map(Math.log(heatMap[moment(row.get('time')).format('M-D-Y')][row.getNum('mag').toFixed(mapAccuracy)]), Math.log(heatMapMin), Math.log(heatMapMax), 1, 0) //log

                stroke(magScale(magColorVal).hex())
                var magLine = line(timescale+barWidth, magYmiddle-magGraphScale,timescale+(barWidth*2),magYmiddle-magGraphScale)
                //magLine.mouseOver(mymap.panTo([row.getNum('latitude'), row.getNum('longitude')],{animate:true}))
                // var depthColorVal = map(depthMap[moment(row.get('time')).format('M-D-Y')][row.getNum('depth').toFixed(mapAccuracy)], depthMapMin, depthMapMax, 0, 1)
                var depthColorVal = map(Math.log(depthMap[moment(row.get('time')).format('M-D-Y')][row.getNum('depth').toFixed(0)]), Math.log(depthMapMin), Math.log(depthMapMax), 0.5, 1) //log
                let depthScale  = chroma.scale('YlGnBu').mode('lch');
                stroke(depthScale(depthColorVal).hex())
                line(timescale+barWidth, depthYmiddle+depthGraphScale,timescale+(barWidth*2),depthYmiddle+depthGraphScale)

                noStroke()
                fill('#636363')
                textAlign(CENTER, CENTER);
                text(moment(then).format('DD MMM'),timescale+(barWidth*1.5), yMiddle)
            }
        }

    }
}


// get the maximum value within a column
function columnMax(tableObject, columnName){
    // get the array of strings in the specified column
    var colStrings = tableObject.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the largest value in the column
    return _.max(colValues);
}

// get the minimum value within a column
function columnMin(tableObject, columnName){
    // get the array of strings in the specified column
    var colStrings = tableObject.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the largest value in the column
    return _.min(colValues);
}

function setupGraph() {

    var xPadding = 0//width*0.1
    var yPadding = height*0.1
    var yMiddle = height/2
    var magYmiddle = (height/2)-yPadding
    var depthYmiddle = (height/2)+yPadding

  
    barWidth = (width*0.8)/(30*2)
  
    //middle line
    stroke('#636363')
    line(0, magYmiddle, w, magYmiddle)
    line(0, depthYmiddle, w, depthYmiddle)

    
    // draw labels
    // noStroke()
    // fill('#636363')
    // textAlign(LEFT)
    // text('Magnitude',xPadding/2, yMiddle/2)
    // textAlign(LEFT)
    // text('Depth',width-xPadding+barWidth, yMiddle+(yMiddle/2))
    
    // draw y axis
    // stroke('#636363')
    // strokeWeight(2)
    // line(xPadding-barWidth, magYmiddle, xPadding-barWidth, yPadding)
    // line(width-xPadding, depthYmiddle, width-xPadding, height-yPadding)
    // strokeWeight(1)
    
    // // tick marks for y axis
    // for (var i=0;i<10;i++){
    //   var magtickPos = map(i,0,9,magYmiddle,yPadding)
    //   var depthtickPos = map(i,0,9,depthYmiddle,height-yPadding)
  
    //   line(xPadding-barWidth, magtickPos, xPadding-barWidth-5, magtickPos)
    //   line(width-xPadding, depthtickPos, width-xPadding+5, depthtickPos)
    // }
  
  }

  //number formatting
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  