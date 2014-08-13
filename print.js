function printPage(){
	if(document.getElementById('pagewrapper') != null){
		var printerFriendlyHTML = "<head>"+
									"<link href='public/styles/printFriend.css' rel='stylesheet'type='text/css'>"+
									"<script src='../print.js'></script>"+
								"</head>";
		var content = document.getElementById('content');
		var save = content.innerHTML;
		
		var graphImage1 = convertCanvasToImage(document.getElementById('graph1'));
		var graphImage2 = convertCanvasToImage(document.getElementById('graph2'));
		document.getElementById('graph1').remove();
		document.getElementById('graph2').remove();
		var img1 = document.getElementById('graph1Img')
		var img2 = document.getElementById('graph2Img')
		img1.src = graphImage1.src;
		img2.src = graphImage2.src;
		img1.style.width = '70%';
		img2.style.width = '70%';
		var sla = document.getElementById('slaResults');
		sla.style.display = 'block';
		var dropToText = document.getElementById('buildDropDownText');
		var drop = document.getElementById('buildNumber');
		dropToText.innerHTML = drop.options[drop.selectedIndex].text;
		dropToText.style.display = 'block';
		dropToText.style.float = 'left';
		drop.remove();

		if(jobName == 'PERF_CI'){

			dropToText = document.getElementById('perfCIText');
			drop = document.getElementById('perfJob');
			dropToText.innerHTML = 'Subjob: <span style="font-size:27px">' +drop.options[drop.selectedIndex].text + '</span>';
			dropToText.style.display = 'block';
			dropToText.style.float = 'left';
			dropToText.style.margin = '10px';
			drop.remove();
		}

		dropToText = document.getElementById('buildPrevDropDownText');
		drop = document.getElementById('prevNumber');
		dropToText.innerHTML = '   ' +drop.options[drop.selectedIndex].text;
		drop.remove();

		dropToText = document.getElementById('mainGDropText');
		drop = document.getElementById('mainGDrop');
		dropToText.innerHTML = drop.options[drop.selectedIndex].text;
		dropToText.style.display = 'block';
		drop.remove();

		dropToText = document.getElementById('otherGDropText');
		drop = document.getElementById('otherGDropServer');
		dropToText.innerHTML = 'The current graph is: '
		dropToText.innerHTML += drop.options[drop.selectedIndex].text;
		drop.remove();
		drop = document.getElementById('otherGDropMetric');
		dropToText.innerHTML += '  '+drop.options[drop.selectedIndex].text;
		dropToText.style.display = 'block';
		drop.remove();

		dropToText = document.getElementById('compareGDropText');
		dropToText.innerHTML = 'The selected graph is: '
		drop = document.getElementById('compareGDropServer');
		dropToText.innerHTML += drop.options[drop.selectedIndex].text;
		drop.remove();
		drop = document.getElementById('compareGDropMetric');
		dropToText.innerHTML += '  '+drop.options[drop.selectedIndex].text;
		dropToText.style.display = 'block';
		drop.remove();

		var formsCollection = document.getElementsByTagName("form");
		while(formsCollection.length > 0)
		{
		   formsCollection['0'].remove();
		   formsCollection = document.getElementsByTagName("form");				   
		}

		printerFriendlyHTML += content.innerHTML;

		window.open().document.write(printerFriendlyHTML);
		content.innerHTML = save;
	}
	else{
		window.print();
	}
		
	
	
	
}