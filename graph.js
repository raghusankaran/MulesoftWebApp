function clearCanvas(nameOfCanvas){
		var canvas = document.getElementById(nameOfCanvas);
		var ctx = canvas.getContext('2d');
	    var x = canvas.width;
	    var y = canvas.height;
	    ctx.clearRect(0, 0, x, y);	    
}


function makeGraph(nameOfCanvas, percentage, yBounds){	
	var canvas = document.getElementById(nameOfCanvas);
	var ctx = canvas.getContext('2d');
    var x = canvas.width-5;
    var y = canvas.height;
    var startX = .05 * x;
    var startY = y*.85;
    ctx.strokeStyle = 'black';
    var graphYAxis = yBounds;

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
    var count = 0; //XXX: UPDATE SOON
    var secondsPerPage = 120;
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
	var result = [data[0], data[1]];

	for(var i=0; i < data.length; i++){
		if(data[i] < result[0]){
			result[0] = data[i];
		}
		else if(data[i] > result[1]){
			result[1] = data[i];
		}
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

function getBounds(data){
	var allMinMax = [];

	for(var line=0; line<data.length; line++){
		allMinMax[allMinMax.length] = getMinAndMax(data[line])[0];
		allMinMax[allMinMax.length] = getMinAndMax(data[line])[1];
	}

	var bounds = getMinAndMax(allMinMax);
	return bounds;
}

/*
	options = {
		    'description': 'nameOfLine1, nameOfLine2, nameOfLine3'
			'data': [[line1...],[line2...],[line3...]]
			'baseline': [line...]
			'percentage': true/false
			}

*/
function updateGraph(nameOfCanvas, options){
	//get bounds
	var bounds = getBounds(options.data);

	makeGraph(nameOfCanvas, options.percentage, bounds);

	for(var line=0; line<data.length; line++){
		addLine(nameOfCanvas, data[line], bounds, 'blue');
	}
	
	
}

function addLine(nameOfCanvas, data, yBounds, color){
	
	
	var canvas = document.getElementById(nameOfCanvas);
	var ctx = canvas.getContext('2d');
    var x = canvas.width;
    var y = canvas.height;
    var startX = .05 * x;
    var startY = y*.9;
    
    var secondsPerPage = 120;

    var width = x*.95/data.length;
    var samples = 10;
    ctx.beginPath();
    ctx.strokeStyle = color;
    
	ctx.lineCap='round';	
	
	ctx.moveTo(startX, startY - (startY/100) * data[i]);
	
	
    var width = (x-startX) / (secondsPerPage/2);
	
	for(var i=0; i<secondsPerPage/2+1; i++)
	{						
		
		var range = yBounds[1]-yBounds[0];
		if( range > 0.00001){
			var value =  data[i+currentStart/2];
			var yPos = startY - startY * ((value-yBounds[0])/range);
			
			ctx.lineTo(startX+ width*i, yPos);
		}
	}
	ctx.stroke();
	ctx.strokeStyle = '#000000';
	
	ctx.save();
	numOfLines++;
}

