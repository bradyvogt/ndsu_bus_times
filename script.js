const MINUTE_RANGE = 60;
const DEFAULT_STOP = "stop_1";

//Set selection if there's one saved
let curr_cookie = checkCookie("selection");
document.getElementById("stopList").value = curr_cookie;

//Current time
var today = new Date();
var isWeekend = false;
updateTime();

//Update time every second
setInterval(updateTime, 1000);

//Filter out weekends for buses
if(today.getDay() == 0 || today.getDay() == 6){
	isWeekend = true;
	document.getElementById("message-box").innerHTML = "No Buses. Have a good weekend!";
}else{
	//Executes default dropdown choice
	updateStopTimes();
}

function updateTime() {
	today = new Date();
	document.getElementById("date-time").innerHTML = today.toLocaleTimeString();
	
	//Update table times every minute
	if(today.getSeconds() == 0){
		updateStopTimes();
	}
}

//Executed when dropdown is selected
function updateStopTimes() {
	//Retrieves selected option from dropdown
	let stopList = document.getElementById("stopList");

	//Remember selection for next time
	setCookie("selection", stopList.value, 12);
	let stop_selection = window[stopList.options[stopList.selectedIndex].value]

	//Don't update times if weekend
	if(isWeekend){return}

	//Gets array of times from selected stop
	let array = getStopTimes(stop_selection, today, MINUTE_RANGE);

	//If there is nothing display message
	if(array[0] == null){
		document.getElementById("message-box").innerHTML = `No Buses (Next ${MINUTE_RANGE} minutes)`;
	}else{
		document.getElementById("message-box").innerHTML = "";
	}
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

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString();
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(cname) {
  let cvalue = getCookie(cname);
  if(cvalue == ""){return DEFAULT_STOP}
  else if(cvalue == null){return "null"}
  else {return cvalue}
}
