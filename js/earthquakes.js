/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
    */

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
	alert('Problem obtaining data: ' + jqXHR.statusText);
});

$(function() {
	getQuakes();
});

function getQuakes() {
	$.getJSON(gov.usgs.quakesUrl, function(quakes) {

		gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
			center: new google.maps.LatLng(0, 0),
			zoom: 2,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			streetViewControl: false
		});

		gov.usgs.quakes = quakes;
		
		$('.message').html("Displaying " + quakes.length + " earthquakes");
		addQuakeMarkers(quakes, gov.usgs.quakesMap);
	});
}

function addQuakeMarkers(quakes, map) {
	var quake;
	var idx;

	for (idx = 0; idx < quakes.length; ++idx) {
		quake = quakes[idx];

		if (quake.location.longitude && quake.location.latitude) {
			var lat = quake.location.latitude;
			var lng = quake.location.longitude;
			quake.mapMarker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(lat, lng)
			});

			addInfoWindowForQuake(quake, map);
		}
	}
}

function addInfoWindowForQuake(quake, map) {
	google.maps.event.addListener(quake.mapMarker, 'click', function() {
		gov.usgs.iw = new google.maps.InfoWindow({
			content: new Date(quake.datetime).toLocaleString() +
			': magnitude ' + quake.magnitude + ' at depth of ' +
			quake.depth + ' meters'
		});

		gov.usgs.iw.open(map, this);
	});
}