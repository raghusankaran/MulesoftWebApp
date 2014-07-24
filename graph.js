var colors = ['blue', 'red', 'green'];

function clearCanvas(nameOfCanvas){
		var canvas = document.getElementById(nameOfCanvas);
		var ctx = canvas.getContext('2d');
	    var x = canvas.width;
	    var y = canvas.height;
	    ctx.clearRect(0, 0, x, y);	    
}


function makeGraph(nameOfCanvas, percentage, bounds, currX, description, colors){	
	clearCanvas(nameOfCanvas);
	var canvas = document.getElementById(nameOfCanvas);
	var ctx = canvas.getContext('2d');
    var x = canvas.width-5;
    var y = canvas.height;
    var startX = .05 * x;
    var startY = y*.85;
    ctx.strokeStyle = 'black';
    ctx.lineCap='round';	
    var graphYAxis = [bounds[0], bounds[1]];
    ctx.font="15px Courier New";
    var legendX = x-400;
    for(var i=0; i < description.length; i++){
    	ctx.strokeStyle ='black';

    	ctx.fillText(description[i], legendX, 30 + 35*i);
    	ctx.strokeStyle =colors[i];
    	ctx.beginPath();
    	ctx.lineWidth = 5;
    	ctx.moveTo(legendX-5, 15 + 25*i);
    	ctx.lineTo(legendX-20, 15 + 25*i);
    	ctx.stroke();

    }
    ctx.font="12px Courier New";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(startX,5);
	ctx.moveTo(startX,startY);
	ctx.lineTo(x, startY);
	ctx.lineWidth = 4;
	ctx.stroke();				
	ctx.lineWidth = 1;
   
    var samples = 10;
    var width = (x-startX) / samples;
    var count = currX; //XXX: UPDATE SOON
    var secondsPerPage = bounds[2];
    for(var i = 0; i < samples; i++){
    	
    	ctx.fillText(('' + count).substring(0,7) ,  startX + width*i , startY + 20);
		count += secondsPerPage/samples;
    }
    ctx.font="20px Courier New";
    ctx.fillText("Time (in Seconds)" ,  startX + width*(samples/2-1) , startY + 50);
   	ctx.font="bold 10px Courier New";

	count =0;
	if(percentage){
		for(var i=graphYAxis[0]; i <= graphYAxis[1]; i+= (graphYAxis[1]-graphYAxis[0])/samples){
			ctx.fillStyle = 'black';
			var text = '' + i;
			ctx.fillText(text.substring(0,5) + '%',startX/5,startY - (startY/samples) * count);
			ctx.stroke();
			count++;
		}
	}
	else{
		for(var i=graphYAxis[0]; i <= graphYAxis[1]; i+= (graphYAxis[1]-graphYAxis[0])/samples){
			ctx.fillStyle = 'black';
			var text = '' + i;
			ctx.fillText(text.substring(0,5),startX/5,startY - (startY/samples) * count);
			ctx.stroke();
			count++;
		}
	}
	count =0;
	ctx.save();

}

function getMinAndMax(data){
	var result = [parseFloat(data[0]), parseFloat(data[0])];

	for(var i=0; i < data.length; i++){
		if(parseFloat(data[i]) < result[0]){
			result[0] = parseFloat(data[i]);
		}
		else if(data[i] > result[1]){
			result[1] = parseFloat(data[i]);
		}
	}
	if(data.length < 5){
		return result;
	}

	if( result[1] == 0){
		result[1] = 10;
	}
	else if(Math.abs(result[1]-result[0]) < 10){
		result[1] *= 1.5;
		result[0] *= .5;
	}
	
	else{
		result[1] *= 1.1;
		result[0] *= .9;
	}
	return result;
}

function getBounds(data, setWidth){
	var allMinMax = [];

	//Find y-bounds
	for(var line=0; line<data.length; line++){
		allMinMax[allMinMax.length] = getMinAndMax(data[line])[0];
		allMinMax[allMinMax.length] = getMinAndMax(data[line])[1];
	}

	var bounds = getMinAndMax(allMinMax);

	
	if(setWidth < 0){
		//Find x-axis range
		var xaxis = [];
		for(var line=0; line<data.length; line++){
			xaxis[xaxis.length] = data[line].length;
		}
		bounds[bounds.length] = getMinAndMax(xaxis)[1] * 2;
	}
	else{
		bounds[bounds.length] = setWidth;
	}
	
	return bounds;
}

/*
	options = {
		    'description': 'nameOfLine1, nameOfLine2, nameOfLine3'
			'data': [[line1...],[line2...],[line3...]]
			'baseline': [line...]
			'percentage': true/false
			'autosize': true/false
			}

*/
function updateGraph(nameOfCanvas, options){
	if(options.autosize){	
		var width = nameOfCanvas.clientWidth;
		var height = nameOfCanvas.clientHeight;
		if (nameOfCanvas.width != width || nameOfCanvas.height != height) {
			nameOfCanvas.width = width;
			nameOfCanvas.height = height;
		}
	}
	//get bounds
	var bounds = getBounds(options.data, options.setWidth);
	if(options.setWidth < 0){options.setWidth = bounds[2];}
	makeGraph(nameOfCanvas, options.percentage, bounds,options.currX, options.description, colors);

	for(var line=0; line<options.data.length; line++){
		addLine(nameOfCanvas, options.data[line], bounds, options.currX, colors[line]);
	}
	
	
}

function resizeCanvas(nameOfCanvas, x, y, options){
	var canvas = document.getElementById(nameOfCanvas);
	var width = x;
	var height = y;
	if (canvas.width != width || canvas.height != height) {
		canvas.width = width;
		//canvas.height = height;
	}
	updateGraph(nameOfCanvas, options);
}
function addLine(nameOfCanvas, data, bounds,currX, color){
	
	
	var canvas = document.getElementById(nameOfCanvas);
	var ctx = canvas.getContext('2d');
    var x = canvas.width;
    var y = canvas.height;
    var startX = .05 * x;
    var startY = y*.85;
    var currentStart = currX;
    var secondsPerPage = bounds[2];

    var width = x*.95/data.length;
    var samples = 10;
    ctx.beginPath();
    ctx.strokeStyle = color;
    
	ctx.lineCap='round';	
	
	ctx.moveTo(startX, startY - (startY/100) * data[i]);
	
	
    var width = (x-startX) / (secondsPerPage/2);
	
	for(var i=0; i<secondsPerPage/2+1; i++)
	{						
		
		var range = bounds[1]-bounds[0];
		if( range > 0.00001){
			var value =  data[i+currentStart/2];
			var yPos = startY - startY * ((value-bounds[0])/range);
			
			ctx.lineTo(startX+ width*i, yPos);
		}
	}
	ctx.stroke();
	ctx.strokeStyle = '#000000';
	
	ctx.save();
}

