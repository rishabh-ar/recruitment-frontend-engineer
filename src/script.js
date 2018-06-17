
var entryIndex = 1; 
var listener = new WebSocket("ws://stocks.mnet.website");
previousTickerPrice = {}

listener.onmessage = function(event) {	
	var input = JSON.parse(event.data);	
	if (input.length) {
		var arrayLength = input.length; 
		for(var i = 0; i < arrayLength; i++) {
			var tableBody = document.getElementById("stock");
			var tableRow = document.createElement("tr");
			var tableData1 = document.createElement("th");
			tableData1.appendChild(document.createTextNode(entryIndex));
			tableData1.setAttribute("scope", "row"); 
			var tableData2 = document.createElement("td");
			tableData2.appendChild(document.createTextNode(input[i][0]));
			var tableData3 = document.createElement("td");
			tableData3.appendChild(document.createTextNode(input[i][1])); 
			var tableData4 = document.createElement("td");			
			tableData4.appendChild(document.createTextNode((new Date(Date.now())).toTimeString()));
			tableRow.appendChild(tableData1); 
			tableRow.appendChild(tableData2); 
			tableRow.appendChild(tableData3);
			tableRow.appendChild(tableData4);
			if (previousTickerPrice[input[i][0]] == null) {
				previousTickerPrice[input[i][0]] = parseFloat(input[i][1]);
			} else {
				var price = parseFloat(input[i][1]);
				if (price < previousTickerPrice[input[i][0]]) {
					tableRow.setAttribute("style", "background-color:#FF0000;"); 
				} else {		
					tableRow.setAttribute("style", "background-color:#90EE90;"); 
				}
				previousTickerPrice[input[i][0]] = price;
			}
			tableBody.appendChild(tableRow);
			entryIndex += 1; 
		}
	}
}