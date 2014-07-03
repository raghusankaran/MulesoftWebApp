function clearCanvas(nameOfCanvas){
		var canvas = document.getElementById(nameOfCanvas);
		var ctx = canvas.getContext('2d');
	    var x = canvas.width;
	    var y = canvas.height;
	    ctx.clearRect(0, 0, x, y);	    
}


function makeGraph(nameOfCanvas, percentage){	
	var canvas = document.getElementById(nameOfCanvas);
	var ctx = canvas.getContext('2d');
    var x = canvas.width-5;
    var y = canvas.height;
    var startX = .05 * x;
    var startY = y*.85;
    ctx.strokeStyle = 'black';
    var graphYAxis = [0,100];

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
			ctx.fillText(text.substring(0,5) + '%',startX/4,startY - (startY/samples) * count);
			ctx.stroke();
			count++;
		}
	}
	else{
		for(var i=graphYAxis[0]; i <= graphYAxis[1]; i+= (graphYAxis[1]-graphYAxis[0])/samples){
			ctx.fillStyle = 'black';
			var text = '' + i;
			ctx.fillText(text.substring(0,5),startX/4,startY - (startY/samples) * count);
			ctx.stroke();
			count++;
		}
	}
	count =0;
	ctx.save();

}