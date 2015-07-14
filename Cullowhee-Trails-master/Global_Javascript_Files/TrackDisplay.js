var myMap;
var currentPositionMarker;
var currentPositionAccuracyCircle;

//The ready function
$(document).ready(function () {

    console.log("Inside ready function");

    drawMap();
    StartCurrentPositionWatcher();

});


//---------------------------------------------------------
// name: drawMap()
//---------------------------------------------------------
function drawMap() {

    console.log("Inside drawMap function");

    //Create an object to hold the map center coordinates
    //Note: Asheville
    var mapCenterCoords = new google.maps.LatLng(35.310581, -83.193939);

    //Create an object to hold our map options
    var mapOptions = {
        center: mapCenterCoords,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Create the map
    myMap = new google.maps.Map(document.getElementById("divMapCanvas"),
                                            mapOptions);

    var myParser = new geoXML3.parser({ map: myMap });
        myParser.parse('KML/WCUTrails.kml');
    console.dir(myParser);
    console.dir(myParser.options);
    console.dir(myParser.docs);

}

//========================
//Name: StartCurrentPositionWatcher
//===================================
function StartCurrentPositionWatcher() {

    //Check that browser supports geolocation
    //If it doesn't, display message and stop any more current position code from running
    if (!navigator.geolocation) {
        alert("GeoLocation info not available");
        return;
    }

    //Get current position -- whenever position changes -- 
    //and pass it to callback function
    navigator.geolocation.watchPosition(cb_UpdateCurrentPositionMarker,
                                            cb_UpdateCurrentPositionMarker_Error,
                                            {
                                                enableHighAccuracy: true,
                                                maximumAge: 1000 //Retrieve new info if older than 5 seconds 
                                            }
                                            );
}


//=================================
// Name: cb_UpdateCurrentPositionMarker
//==================================
function cb_UpdateCurrentPositionMarker(positionObject) {

    var lat = positionObject.coords.latitude;
    var long = positionObject.coords.longitude;
    var myLatlng = new google.maps.LatLng(lat, long);
    var accuracy = positionObject.coords.accuracy;
    console.log("Current location: (" + lat + ", " + long + "), " +
                                 "Accuracy: " + accuracy + " meters");



    //Clear old marker (if exists)
    if (currentPositionMarker) {
        currentPositionMarker.setMap(null);
    }

    //Add marker to map
    currentPositionMarker = new google.maps.Marker({
        position: myLatlng,
        map: myMap,
        icon: 'Images/pin_red.png'
    });

    var displayContent = "Accuracy:  " + accuracy + " meters.";

    //Set content of infoWindow
    var infoWindow = new google.maps.InfoWindow({ content: displayContent });

    //Add event handler to display infoWindo when user clicks on marker
    google.maps.event.addListener(currentPositionMarker, 'click',
                                             function () {
                                                 infoWindow.open(myMap, currentPositionMarker);
                                             });

    // Construct the circle
    var currentPositionAccuracyCircleOptions = {
        strokeColor: "#3399FF",
        strokeOpacity: 0.7,
        strokeWeight: 1,
        fillColor: "#CCFFFF",
        fillOpacity: 0.35,
        map: myMap,
        center: myLatlng,
        radius: accuracy
    };

    //Clear old circle (if exists)
    if (currentPositionAccuracyCircle) {
        currentPositionAccuracyCircle.setMap(null);
    }
    currentPositionAccuracyCircle = new google.maps.Circle(currentPositionAccuracyCircleOptions);

}

//=====================================
// Name:            cb_UpdateCurrentPositionMarker_Error
// Description:     Callback function: 
//=====================================
function cb_UpdateCurrentPositionMarker_Error(err) {

    var errorMessage;

    if (err.code == 1) {
        errorMessage = "You chose not to share your location info.";
    }
    else if (err.code == 2) {
        errorMessage = "Location information currently unavailable!";
    }
    else if (err.code == 3) {
        errorMessage = "Timed out waiting to receive location information!";
    }
    else {
        errorMessage = "Unknown error occured";
    }
}