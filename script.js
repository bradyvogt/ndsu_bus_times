//Current time
let today = new Date('2000-01-01T10:47:00');
const MINUTE_RANGE = 60;

//Display 12hr time in page
document.getElementById("date-time").innerHTML = toAmPm(today.getHours(),today.getMinutes());

//Executes default dropdown choice
dropSelect();

//Executed when dropdown is selected
function dropSelect() {
	//Retrieves selected option from dropdown
	let stopList = document.getElementById("stopList");  
	document.getElementById("stop-choice").innerHTML = stopList.options[stopList.selectedIndex].text;
	let stop_selection = window[stopList.options[stopList.selectedIndex].value]

	//Gets array of times from selected stop
	let array = getStopTimes(stop_selection, today, MINUTE_RANGE);

	//Creates html table from array
	updateTable(array);
}

//Updates data in table based on array data
function updateTable(inputArray) {
	let table = document.getElementById('results-table');
	let tbody = document.getElementById("tableBody");
	
	//Delete current data
	let num_of_rows = table.rows.length;

	for(let i = 0; i < num_of_rows-1; i++){
		table.deleteRow(-1); //Deletes last row
	}

	//Converts inputArray to appended HTML table rows
	inputArray.forEach(function(rowData) {
		let row = document.createElement('tr');

		rowData.forEach(function(cellData) {
		  let cell = document.createElement('td');
		  cell.appendChild(document.createTextNode(cellData));
		  row.appendChild(cell);
		});

		tbody.appendChild(row);
	});
}

//Returns 2d Array with stops within time range
function getStopTimes(busStopList, currDate, minuteRange){
	let stops_array = [];

	//Loops through all times in busStopList
	for (let i = 0; i < busStopList.length; i++){
		let time = busStopList[i].time;
		let hour = parseInt(time.split(":")[0]);
		let minute = parseInt(time.split(":")[1]);

		//Instantiate new date using time in data set
		new_date = new Date(`2000-01-01T${("0" + time).slice(-5)}:00`);

		//TODO: Doesn't need to evaluate difference if not in range
		//Calculate minute difference
		let minute_diff = minuteDiff(currDate,new_date);

		//Assign stop info to array
		if(minute_diff >= 0 && minute_diff <= minuteRange){
			stops_array.push([busStopList[i].route, toAmPm(hour,minute), minute_diff])
		}
	}
	//Sort stops_array by Wait Time (asc)
	stops_array.sort(function (a, b) {return a[2] - b[2];});

	//Add "min" to wait time
	for(let i = 0; i < stops_array.length; i++){
		stops_array[i][2] += " min";
	}

	return stops_array;
}

//Converts 24hr time to 12hr
function toAmPm(hours, minutes){
	//Determines AM or PM suffix
	let am_pm;
	if(hours<12){am_pm="AM"}else{am_pm="PM"}

	//Determines adding or subtracting 12 hours
	if(hours > 12){hours-=12}
	else if(hours == 0){hours+=12}

	//Creates string of time in 12hr format
	let display_time = `${hours}:${("0" + minutes).slice(-2)} ${am_pm}`;

	return display_time
}

//Calculates difference between two times (within a date)
function minuteDiff(startDate, endDate){
	hour_diff = endDate.getHours() - startDate.getHours();
	minute_diff = endDate.getMinutes() - startDate.getMinutes();

	return hour_diff*60+minute_diff;
}