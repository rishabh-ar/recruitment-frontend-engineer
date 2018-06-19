function timeDifference(previous, current = Date.now()) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
         return Math.round(elapsed / 1000) + ' seconds ago';   
    } else if (elapsed < msPerHour) {
         return Math.round(elapsed / msPerMinute) + ' minutes ago';   
    } else if (elapsed < msPerDay ) {
         return Math.round(elapsed / msPerHour ) + ' hours ago';   
    } else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';   
    } else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';   
    }     
    return 'approximately ' + Math.round(elapsed / msPerYear ) + ' years ago';   
}

function updateTime(currTime = Date.now()) {
	for (var key in timeColumn) {
		var colObject = timeColumn[key];
		colObject.childNodes[0].data = timeDifference(colObject.getAttribute("data-time"), currTime);
	}	
}

var listener = new WebSocket("ws://stocks.mnet.website");

previousTickerPrice = {}
maxTickerPrice = {}
minTickerPrice = {}
rowElements = {}
timeColumn = {}

listener.onmessage = function(event) {	
	
	var input = JSON.parse(event.data);	
	var arrayLength = input.length; 
	
	if (arrayLength) {
		for(var i = 0; i < arrayLength; i++) {

			var price = parseFloat(input[i][1]);
			price = Number(price.toFixed(2)); 
			
			if (previousTickerPrice[input[i][0]] != null) {	
				maxTickerPrice[input[i][0]] = Math.max(maxTickerPrice[input[i][0]], price);
				minTickerPrice[input[i][0]] = Math.min(minTickerPrice[input[i][0]], price);

				if (price < previousTickerPrice[input[i][0]]) {
					rowElements[input[i][0]].setAttribute("bgcolor", "e60000"); 
				} else {	
					rowElements[input[i][0]].setAttribute("bgcolor", "#00ff00"); 
				}
				
				var diff = price - previousTickerPrice[input[i][0]];
				diff = Number(diff.toFixed(2));
				if (diff > 0) diff = '+' + diff;
				children = rowElements[input[i][0]].childNodes; 
				children[1].childNodes[0].data = price; 
				children[2].childNodes[0].data = diff; 
				children[3].childNodes[0].data = maxTickerPrice[input[i][0]]; 
				children[4].childNodes[0].data = minTickerPrice[input[i][0]]; 
				children[5].setAttribute("data-time", Date.now());
			} else {

				var tableBody = document.getElementById("stock");
				
				var tableRow = document.createElement("tr");
				
				var tableData1 = document.createElement("td");
				tableData1.appendChild(document.createTextNode(input[i][0]));
				
				var tableData2 = document.createElement("td"); 
				tableData2.appendChild(document.createTextNode(price)); 
				
				var tableData3 = document.createElement("td"); 
				tableData3.appendChild(document.createTextNode('')); 
				
				var tableData4 = document.createElement("td");
				tableData4.appendChild(document.createTextNode(price));
				
				var tableData5 = document.createElement("td");
				tableData5.appendChild(document.createTextNode(price));
				
				var tableData6 = document.createElement("td");			 
				tableData6.appendChild(document.createTextNode(Date.now()));
				tableData6.setAttribute("class", "timeField");
				tableData6.setAttribute("data-time", Date.now());
				timeColumn[input[i][0]] = tableData6; 

				tableRow.appendChild(tableData1); 
				tableRow.appendChild(tableData2); 
				tableRow.appendChild(tableData3);
				tableRow.appendChild(tableData4);
				tableRow.appendChild(tableData5);
				tableRow.appendChild(tableData6);
				tableRow.setAttribute("bgcolor", "#ffffcc"); 
				tableBody.appendChild(tableRow);

				rowElements[input[i][0]] = tableRow; 
				maxTickerPrice[input[i][0]] = price; 
				minTickerPrice[input[i][0]] = price; 
			}
			previousTickerPrice[input[i][0]] = price;
		}		
		var tableBody = document.getElementById("stock");
		updateTime();
	}
}