
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

var listener = new WebSocket("ws://stocks.mnet.website");
previousTickerPrice = {}
rowElements = {}

function updateTime(node, currTime) {
	var children = node.childNodes; 
	if (node.tagName == 'TD' && node.className == 'timeField') {
		children[0].data = timeDifference(node.getAttribute("data-time"), currTime);
	}
	for (var i = 0; i < children.length; i++) {
		updateTime(children[i]);
	}
}

listener.onmessage = function(event) {	
	var input = JSON.parse(event.data);	
	if (input.length) {
		var arrayLength = input.length; 
		for(var i = 0; i < arrayLength; i++) {
			var price = parseFloat(input[i][1]);
			price = Number(price.toFixed(2));	
			if (previousTickerPrice[input[i][0]] != null) {
				if (price < previousTickerPrice[input[i][0]]) {
					rowElements[input[i][0]].setAttribute("class", "table-danger"); 
				} else {	
					rowElements[input[i][0]].setAttribute("class", "table-success"); 
				}
				var diff = price - previousTickerPrice[input[i][0]];
				diff = Number(diff.toFixed(2));
				if (diff > 0) diff = '+' + diff;
				children = rowElements[input[i][0]].childNodes; 
				children[1].childNodes[0].data = price + ' (' + diff + ')'; 
				children[2].setAttribute("data-time", Date.now());
			} else {
				var tableBody = document.getElementById("stock");
				var tableRow = document.createElement("tr");
				var tableData1 = document.createElement("td");
				tableData1.appendChild(document.createTextNode(input[i][0]));
				var tableData2 = document.createElement("td"); 
				tableData2.appendChild(document.createTextNode(price)); 
				var tableData3 = document.createElement("td");			 
				tableData3.appendChild(document.createTextNode(Date.now()));
				tableData3.setAttribute("class", "timeField");
				tableData3.setAttribute("data-time", Date.now());  
				tableRow.appendChild(tableData1); 
				tableRow.appendChild(tableData2); 
				tableRow.appendChild(tableData3);
				tableBody.appendChild(tableRow); 
				rowElements[input[i][0]] = tableRow; 
			}
			previousTickerPrice[input[i][0]] = price;
		}		
		var tableBody = document.getElementById("stock");
		updateTime(tableBody, Date.now());
	}
}